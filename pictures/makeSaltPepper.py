import numpy as np # This is the main numerical library we will use
import matplotlib.pyplot as plt # This is the main plotting library we will use
import skimage # A library for doing some extra stuff with image processing
import skimage.io

thresh = 0.05
X = skimage.io.imread("WinterTree.jpg")
noise = np.random.rand(X.shape[0], X.shape[1])
noise = noise[:, :, None]
noise = np.concatenate((noise, noise, noise), axis=2)
X[noise < thresh] = 0
X[noise > 1-thresh] = 255
skimage.io.imsave("WinterTreeSalt.jpg", X)
