#!/usr/bin/env python

import os
import sys

lib_path = os.path.realpath(os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'lib'))
if lib_path not in sys.path:
    sys.path[0:0] = [lib_path]

import utils
import clusterers
import processors
import simplejson as json
import os
import argparse
import analyzers
import tokenizers
import numpy as np
from sklearn.feature_extraction import DictVectorizer
from sklearn import svm, preprocessing, cross_validation
from sklearn.metrics import precision_recall_curve, auc, classification_report, precision_recall_fscore_support
import collections

def main(args):
    # path = utils.get_data_path(args.site[0])

    sites = ['theverge', 'sina', 'qq', 'techcrunch', 'usatoday', 'npr', 'prothomalo']

    all_continuous_features = []
    all_discrete_features= []
    all_labels = []

    for site in sites:
        print 'clustering %s ...' % site

        path = utils.get_data_path(site)
        urls = utils.load_urls(path)

        # load data
        data = [utils.load_data(path, id) for id, url in enumerate(urls)]

        # process data
        processor = processors.Processor(data, tokenizer=tokenizers.GenericTokenizer, analyzer=analyzers.LongestAnalyzer)
        features = processor.extract()

        # clustering
        clusterer = clusterers.DBSCAN()
        labels = clusterer.cluster(features).labels_

        # prepare features
        continuous_features, discrete_features, labels = processor.prepare(labels)
        all_continuous_features += continuous_features
        all_discrete_features += discrete_features
        all_labels += labels


    vectorizer = DictVectorizer()
    discrete_features = vectorizer.fit_transform(all_discrete_features).toarray()
    continuous_features = np.array(all_continuous_features)
    labels = np.array(all_labels).astype(np.float32)

    features = np.hstack([continuous_features, discrete_features]).astype(np.float32)

    precisions = []
    recalls = []
    f1scores = []
    supports = []

    rs = cross_validation.KFold(len(labels), n_folds=4, shuffle=False, random_state=0)
    for train_index, test_index in rs:
        print 'training size = %d, testing size = %d' % (len(train_index), len(test_index))

        clf = svm.SVC(verbose=False, kernel='linear', probability=False, random_state=0, cache_size=2000, class_weight='auto')
        clf.fit(features[train_index], labels[train_index])

        predicted = clf.predict(features[test_index])
        print classification_report(labels[test_index], predicted)

        precision, recall, f1score, support = precision_recall_fscore_support(labels[test_index], predicted)

        precisions.append(precision)
        recalls.append(recall)
        f1scores.append(f1score)
        supports.append(support)

    precisions = np.mean(np.array(precisions), axis=0)
    recalls = np.mean(np.array(recalls), axis=0)
    f1scores = np.mean(np.array(f1scores), axis=0)
    supports = np.mean(np.array(supports), axis=0)

    for label in range(2):
        print '%f\t%f\t%f\t%f' % (precisions[label], recalls[label], f1scores[label], supports[label])

    return

    """
    ham = collections.defaultdict(dict)
    spam = collections.defaultdict(dict)

    for id, cluster in clusters.iteritems():
        for page in cluster['pages'].values():
            content = ''
            for text in page['texts']:
                content += ' '.join(text['text'])
            if cluster['label'] is 1:
                ham[url][id] = content
            else:
                spam[url][id] = content


    with open(os.path.join(path, 'svm.json'), 'w') as f:
        f.write(json.dumps({'ham': ham, 'spam': spam}, indent=2, ensure_ascii=False).encode('utf8'))
    """

def parse_args():
    """
    Parse commandline arguments
    """
    parser = argparse.ArgumentParser(description='Run the whole pipeline on site pages.')
    parser.add_argument('site', metavar='site', type=str, nargs=1, help='site id, for example: theverge, npr, nytimes')
    return parser.parse_args()

if __name__ == '__main__':
    main(parse_args())
