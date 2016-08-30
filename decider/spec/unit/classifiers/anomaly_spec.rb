# encoding: UTF-8
require File.dirname(__FILE__) + "/../../spec_helper"

describe Classifier::Anomaly do
  
  before(:each) do
    @anomaly_detector = Classifier::Anomaly.new(:cool, :lame)
  end
  
  it "should compute the average score of the documents in each class" do
    @anomaly_detector.should_receive(:scores_of_all_documents).and_return({:cool=>[0.9,0.85,0.95], :lame=>[0.1,0.15,0.05]})
    result = @anomaly_detector.avg_scores
    result[:cool].should be_close(0.9, 0.000001)
    result[:lame].should be_close(0.1, 0.000001)
  end
  
  it "should compute the standard deviation of the scores of the training docs" do
    @anomaly_detector.should_receive(:scores_of_all_documents).and_return({:cool=>[0.9,0.85,0.95], :lame=>[0.1,0.15,0.05]})
    result = @anomaly_detector.stddevs
    result[:cool].should be_close(0.04082, 0.00001)
  end
  
  it "should compute the number of standard deviations from the mean for a document" do
    @anomaly_detector.stub!(:scores).and_return(:one_class => 0.75)
    @anomaly_detector.stub!(:avg_scores).and_return(:one_class => 0.85)
    @anomaly_detector.stub!(:stddevs).and_return(:one_class => 0.05)
    @anomaly_detector.anomaly_score("an innocuous document")[:one_class].should be_close(2.0, 0.00001)
  end
  

  context "detecting anomalies with the statistical algorithm" do

    before do
      @classifier = Classifier::Anomaly.new(:normal)
    end

    it "should complain if asked to do anomaly detection and it has 2+ classes" do
      strange_request = lambda { Classifier::Anomaly.new(:bayes, :spam, :ham).anomalous?("text")}
      strange_request.should raise_error
    end

    it "should classify a document as anomalous the document has an anomaly score > 3" do
      @classifier.normal.should_receive(:anomaly_score_of_document).with("rubyist loving java").and_return(11)
      @classifier.anomalous?("rubyist loving java").should be_true
    end

  end

end
