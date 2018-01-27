import cPickle as pickle
from midi_to_statematrix import *
import model, multi_training, midi_to_statematrix
import sys, random, data, time, os
import threading
from threading import Thread


def modelFromFile(filename):
  learned_list = pickle.load(open(filename, 'rb'))
  mod = model.Model()
  mod.learned_config = learned_list
  return mod

percentDoneApprox = 0
lock = threading.Lock() 

if __name__ == '__main__':

  print "Starting execution"

  if len(sys.argv) != 4:
    print "Needs exactly three args, configfile, output file and number of seconds of music to make"
    exit(1)

  #parameter file that contains results of training
  paramfile = sys.argv[1]
  if not os.path.isfile(paramfile):
    print "paramfile {} does not exist.".format(paramfile)
    exit(1)

  #output file to write to
  outfile = sys.argv[2]

  #number of seconds of music to generate
  numseconds = int(sys.argv[3])

  print "{}: Loading model from file {}".format(time.strftime("%c"), paramfile)
  sys.stdout.flush()
  mod = modelFromFile(paramfile)
  print "{}: Done loading model.".format(time.strftime("%c"))

  pitchrange = midi_to_statematrix.upperBound - midi_to_statematrix.lowerBound
  #We need to construct one slice to initialize the music generation
  firstSlice = []
  for i in range(0, pitchrange):
    pair = [0, 0]
    #70% chance note is played
    if random.randrange(10) > 7:
      pair[0] = 1
      #50% chance note is "terminal", i.e.,
      #not extended
      if random.randrange(10) > 5:
        pair[1] = 1
    firstSlice.append(pair)
  firstSlice = [firstSlice]

  xOpt = firstSlice
  xIpt = data.noteStateMatrixToInputForm(firstSlice)

  print "Numseconds received: {}".format(numseconds)
  sys.stdout.flush()
  slices_to_generate = 8 * numseconds
  print "{}: Generating music to output/generated...".format(time.strftime("%c"))
  sys.stdout.flush()

  def outputPercentages():
    global percentDoneApprox
    global lock
    while percentDoneApprox != 100:
      time.sleep(float(numseconds * 4)/100)
      percentDoneApprox += 1
      lock.acquire()
      print "PERCENT: {}".format(percentDoneApprox)
      sys.stdout.flush()
      lock.release()
    print "Percent printing thread exiting"
    sys.stdout.flush()

  t = Thread(target = outputPercentages)
  t.start()

  print "Slices to generate: {}".format(slices_to_generate)
  sys.stdout.flush()
  outputStateMatrix = numpy.concatenate((numpy.expand_dims(xOpt[0], 0), mod.predict_fun(slices_to_generate, 1, xIpt[0])), axis=0)
  
  print "Num slices in output matrix: {}".format(len(outputStateMatrix))
  sys.stdout.flush()
  noteStateMatrixToMidi(outputStateMatrix, outfile)

  lock.acquire()
  print "{}: Done.".format(time.strftime("%c"))
  sys.stdout.flush()
  lock.release()
  os._exit(0)



