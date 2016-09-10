import numpy
import encode


def as_int16(data):
  ''' Return data encoded as signed 16 bit integer
  '''
  data = data.clip(-1, 1)
  return (data * 32767).astype(numpy.int16)


def as_uint8(data):
  ''' Return data encoded as unsigned 8 bit integer
  '''
  data = (data / 2 + 0.5).clip(0, 1)
  return (data * 255).astype(numpy.uint8)


def pygame_play(data, rate=44100):
  ''' Send audio array to pygame for playback
  '''
  import pygame
  pygame.mixer.init(rate, -16, 1, 1024)
  sound = pygame.sndarray.numpysnd.make_sound(as_int16(data))
  length = sound.get_length()
  sound.play()
  pygame.time.wait(int(length * 1000))
  pygame.quit()


def pygame_supported():
  ''' Return True is pygame playback is supported
  '''
  try:
    import pygame
  except:
    return False
  return True


def oss_play(data, rate=44100):
  ''' Send audio array to oss for playback
  '''
  import ossaudiodev
  audio = ossaudiodev.open('/dev/audio','w')
  formats = audio.getfmts()
  if ossaudiodev.AFMT_S16_LE in formats:
    # Use 16 bit if available
    audio.setfmt(ossaudiodev.AFMT_S16_LE)
    data = as_int16(data)
  elif ossaudiodev.AFMT_U8 in formats:
    # Otherwise use 8 bit
    audio.setfmt(ossaudiodev.AFMT_U8)
    data = as_uint8(data)
  audio.speed(rate)
  while len(data):
    audio.write(data[:1024])
    data = data[1024:]
  audio.flush()
  audio.sync()
  audio.close()


def oss_supported():
  ''' Return True is oss playback is supported
  '''
  try:
    import ossaudiodev
  except:
    return False
  return True


def pyaudio_play(data, rate=44100):
  ''' Send audio array to pyaudio for playback
  '''
  import pyaudio
  p = pyaudio.PyAudio()
  stream = p.open(format=pyaudio.paFloat32, channels=1, rate=rate, output=1)
  stream.write(data.astype(numpy.float32).tostring())
  stream.close()
  p.terminate()


def pyaudio_supported():
  ''' Return True is pyaudio playback is supported
  '''
  try:
    import pyaudio
  except:
    return False
  return True


def play(data, rate=44100):
  ''' Send audio to first available playback method
  '''
  if pygame_supported():
    return pygame_play(data, rate)
  elif oss_supported():
    return oss_play(data, rate)
  elif pyaudio_supported():
    return pyaudio_play(data, rate)
  else:
    raise Exception("No supported playback method found")
