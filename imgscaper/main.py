#!/usr/bin/env python3

import sys
import math
import heapq
import random
import logging
import itertools

import numpy as np
import scipy.misc

import ops


PATCH_SIZE   = 128
PATCH_HALF   = PATCH_SIZE//2
PATCH_MIDDLE = PATCH_SIZE//2-1
PATCH_FINISH = PATCH_SIZE//2
PATCH_START  = -PATCH_FINISH+1

BIN_COUNT    = 128
BLUR_SIGMA   = 24.0
LIGHTNESS_POWER = 0.25

PATCH_COUNT = 100
BEST_COUNT = 5



def window(img):
    return img[PATCH_HALF:-PATCH_HALF, PATCH_HALF:-PATCH_HALF]



class ImageScaper(object):
    """Main functionality used to generate images, either one static image if called
    from a script or a sequence of images if used as an API.
    """

    def __init__(self, source, spec):
        """Given a source image with interesting patterns and a specification that
        indicates desired luminosity (normalized), prepare an output image.

        Arguments:
            :source:    Image as 2D array of HLS-encoded pixels.
            :spec:      Image as 2D array of greyscale pixels.
        """

        # Source image is now blurred, then encoded to be a HLS-encoded array.
        logging.debug("Converting to HLS color space.")
        self.img = source
        self.img_size = source.shape
        self.img_blurred = ops.blur(source, BLUR_SIGMA)
        self.img_luminosity = ops.rgb2hls(self.img_blurred)[:,:,1]

        # Now we make a histogram of the blurred luminosities, each in bins.
        logging.debug("Preparing first version of output.")
        L = window(self.img_luminosity)
        hist, bins = np.histogram(L, density=True, bins=BIN_COUNT)
        L_indices = np.digitize(L.flatten(), bins)

        # Store the center of all patches by using the luminosity bins. 
        coordinates = np.indices((source.shape[0]-PATCH_SIZE, source.shape[1]-PATCH_SIZE)).swapaxes(0,2).swapaxes(0,1)
        coordinates += [PATCH_HALF, PATCH_HALF]
        self.c_coords = self.createBins(L_indices, coordinates)

        # For each bin we calculate the average color, per-luminosity which assumes
        # the image patterns don't have too much hue variation.
        c_buckets = self.createBins(L_indices, window(self.img_blurred))
        c_averages = [np.average(bucket, axis=0) for bucket in c_buckets]

        # Normalize the specification image based on what our luminosity can provide.
        ml = min(L.flatten())
        sl = max(L.flatten()) - ml
        self.spec = ml + spec * sl

        # Apply the same binning process to the spec image....
        S_indices = np.digitize(self.spec.flatten(), bins)
        self.spec_bins = {}
        for i, bn in enumerate(S_indices):
            # Check coordinates and discard if it's out of bounds.
            ty, tx = i//self.spec.shape[1], i%self.spec.shape[1]
            if ty+PATCH_START < 0 or ty+PATCH_FINISH > self.spec.shape[0]:
                continue
            if tx+PATCH_START < 0 or tx+PATCH_FINISH > self.spec.shape[1]:
                continue
            self.spec_bins[(ty, tx)] = min(bn-1, BIN_COUNT-1)

        # Generate a first version of the output based on the average given the luminosity
        # of the specification.  There are no interesting patterns, just colors.
        self.output = np.array([c_averages[min(bn-1, BIN_COUNT-1)] for bn in S_indices], dtype=np.float32)\
                            .reshape(self.spec.shape[0], self.spec.shape[1], 3)
        self.coverage = np.zeros(self.output.shape[:2], dtype=np.float32)

        # Prepare a masking array used for blending and feathering out the edges of patches.
        self.createMask()


    def process(self, iterations=None):
        """Randomly pick locations to add patches to the output image, and pick the best 
        parts of the source image accordingly.
        """
        logging.debug("Iteratively splatting patches...")

        resolution = self.coverage.shape[0] - PATCH_SIZE, self.coverage.shape[1] - PATCH_SIZE
        count, total = 0, resolution[0] * resolution[1]
        while iterations is None or count < iterations:
            count += 1

            # Determine pixel coverage for output image inside the target window.
            cover = window(self.coverage)
            ay, ax = np.where(cover < 1.0)
            if len(ay) == 0:
                # No more pixels left to cover, if specific number of iterations was requested
                # then we cover each pixels once more!
                if iterations is not None:
                    self.coverage[:,:] -= 1.0
                    continue
                else:
                    break

            # Select a random pixel index (ty, tx) and determine its bin (bn).
            i = random.randint(0, len(ay)-1)
            ty, tx = ay[i] + PATCH_HALF, ax[i] + PATCH_HALF
            bn = self.spec_bins[(ty,tx)]

            # In some cases the bins chosen may not contain any samples, in that case
            # just ignore this pixel and try again.
            if len(self.c_coords[bn-1]) == 0:
                self.coverage[ty,tx] += 1.0
                continue

            # Find a source image patch for this target coordinate, and then splat it!
            sy, sx = self.pickBestPatch(ty, tx, self.c_coords[bn-1])
            if sx == -1 or sy == -1:
                continue

            self.splatThisPatch(sy, sx, ty, tx)

            # The final stages are slower as many remaining pixels require their own patch.
            progress = math.pow(1.0 - len(ay) / total, 3.0)
            sys.stdout.write("%3.1f%%\r" % (100.0 * progress)); sys.stdout.flush();

        # The output image can now be used in its current form, or other
        # iterations may be performed.
        repro = self.output.reshape(self.spec.shape[0], self.spec.shape[1], 3)
        return repro, len(ay) == 0


    def createBins(self, indices, array):
        """Given a histogram's bin and a set of binned indices, select the subset of the
        array that correspons to each of the bins.
        """
        flat_array = array.reshape(array.shape[0] * array.shape[1], array.shape[2])
        return [flat_array[indices == i] for i in range(1, BIN_COUNT+1)]


    def createMask(self):
        """Create a square mask for blending that fades out towards the edges and has a solid
        block of unblended pixels in the middle.
        """
        mask_x = np.array([abs(x-PATCH_MIDDLE) for y, x in itertools.product(range(PATCH_SIZE-1), repeat=2)], dtype=np.float32) / (PATCH_FINISH-1)
        mask_y = np.array([abs(y-PATCH_MIDDLE) for y, x in itertools.product(range(PATCH_SIZE-1), repeat=2)], dtype=np.float32) / (PATCH_FINISH-1)

        mask_x = mask_x.reshape(PATCH_SIZE-1, PATCH_SIZE-1)
        mask_y = mask_y.reshape(PATCH_SIZE-1, PATCH_SIZE-1)

        mask = 2.0 * (1.0 - mask_x) * (1.0 - mask_y)
        mask[mask > 1.0] = 1.0

        self.mask = mask


    def D(self, sy, sx, ty, tx):
        """Calculate the cost of blending this patch from the source image into the output
        image, based on the squared distance of each pixel component (HLS).
        """
        return ((self.img[sy+PATCH_START:sy+PATCH_FINISH,sx+PATCH_START:sx+PATCH_FINISH]
               - self.output[ty+PATCH_START:ty+PATCH_FINISH,tx+PATCH_START:tx+PATCH_FINISH])**2).sum()


    def splatThisPatch(self, sy, sx, ty, tx):
        """Store a patch centered on (ty, tx) in the output image based on the source
        image at location (sy, sx), using the blend mask calculated statically.
        """
        for i in range(3):
            self.output[ty+PATCH_START:ty+PATCH_FINISH,tx+PATCH_START:tx+PATCH_FINISH,i] = \
                self.output[ty+PATCH_START:ty+PATCH_FINISH,tx+PATCH_START:tx+PATCH_FINISH,i] * (1.0 - self.mask) \
              + self.img[sy+PATCH_START:sy+PATCH_FINISH,sx+PATCH_START:sx+PATCH_FINISH,i] * self.mask

        self.coverage[ty+PATCH_START:ty+PATCH_FINISH,tx+PATCH_START:tx+PATCH_FINISH] += self.mask


    def pickBestPatch(self, ty, tx, coords):
        """Iterate over a random selection of patches (e.g. 100) and pick a random
        sample of the best (e.g. top 5).  Distance metric is used to rank the patches.
        """
        results = []
        for sy, sx in random.sample(list(coords), min(len(coords), PATCH_COUNT)):
            d = self.D(sy, sx, ty, tx)
            heapq.heappush(results, (d, len(results), (sy,sx)))
        
        # Some unlucky cases with special images cause no patches to be found
        # at all, in this case we just bail out.
        if not results:
            return -1, -1

        choices = heapq.nsmallest(BEST_COUNT, results)
        return random.choice(choices)[2]



def main(args):
    if len(args) != 3:
        logging.error("Provide [spec] [example] [output] as script parameters.", file=sys.stderr)
        return -1

    # The input specification is read as-is from disk, though it can be created
    # using a distance field like ops.distance() as in previous versions.
    logging.info("Loading input specification file.")
    spec = ops.normalized(scipy.misc.imread(args[0]).astype(dtype=np.float32))

    # Create a bigger array so there's room around the edges to apply large patches.
    # Numpy doesn't make clamping efficient or easy, so it's best just resize before starting.
    spec_copy = np.zeros((spec.shape[0]+PATCH_SIZE, spec.shape[1]+PATCH_SIZE), dtype=spec.dtype)
    spec_copy[PATCH_SIZE//2:-PATCH_SIZE//2, PATCH_SIZE//2:-PATCH_SIZE//2] = spec

    # This is the example input, for example a high-resolution photo or a textu
    # copy the style from.
    logging.info("Loading input example image.")
    src = scipy.misc.imread(args[1]).astype(dtype=np.float32)

    scraper = ImageScaper(src, spec_copy)
    output, _ = scraper.process()

    logging.info("Saving generated image to disk.")
    scipy.misc.imsave(args[2], window(output))


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG, format="%(levelname)s: %(message)s")
    main(sys.argv[1:])
