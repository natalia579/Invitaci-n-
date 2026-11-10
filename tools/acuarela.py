import cv2, numpy as np, sys
src = cv2.imread(sys.argv[1]); h, w = src.shape[:2]
cw = int(h*0.75); x0 = int(sys.argv[3])
W, H = 900, 1200
img = cv2.resize(src[:, x0:x0+cw], (W,H), interpolation=cv2.INTER_AREA)
rng = np.random.default_rng(11)
def noise(scale, octaves=3):
    acc=np.zeros((H,W),np.float32); amp=1; tot=0
    for o in range(octaves):
        s=max(2,int(scale/(2**o))); n=rng.random((H//s+2,W//s+2)).astype(np.float32)
        acc+=amp*cv2.resize(n,(W,H),interpolation=cv2.INTER_CUBIC); tot+=amp; amp*=0.5
    return acc/tot

# 1) simplificar como pinceladas
sm = img.copy()
for _ in range(2): sm = cv2.edgePreservingFilter(sm, flags=1, sigma_s=50, sigma_r=0.4)
lab = cv2.cvtColor(sm, cv2.COLOR_BGR2LAB).astype(np.float32)
Z = lab.reshape(-1,3)
_, lbl, cen = cv2.kmeans(Z, 12, None, (cv2.TERM_CRITERIA_EPS+cv2.TERM_CRITERIA_MAX_ITER, 25, 0.5), 3, cv2.KMEANS_PP_CENTERS)
lbl = lbl.reshape(H,W)

# 2) recolorear cada mancha con una paleta pastel (Lab, 0-255 OpenCV)
new = np.zeros_like(cen)
for i,(L,a,b) in enumerate(cen):
    A, B = a-128, b-128
    chroma = np.hypot(A,B); hue = np.degrees(np.arctan2(B,A))
    Ln = 122 + 0.52*L           # luminoso: el papel se ve a través
    if B < -2 or (chroma < 9 and L > 170):   # cielo
        An, Bn = -3, -9
    elif A < -3 or L < 115:      # verdes y sombras del follaje -> salvia
        k = min(1.0, max(chroma, 12)/38)
        An, Bn = -11*k-3, 11*k+9
    else:                        # tierra / camino
        An, Bn = A*0.6+3, B*0.6+7
    new[i] = (np.clip(Ln,0,255), An+128, Bn+128)
paint = new[lbl]
# matices dentro de cada mancha (detalle del follaje, suave)
detail = (lab[...,0] - cen[lbl][...,0])*0.45
paint[...,0] = np.clip(paint[...,0] + detail, 0, 255)
paint = cv2.cvtColor(paint.astype(np.uint8), cv2.COLOR_LAB2BGR).astype(np.float32)
paint = cv2.GaussianBlur(paint, (0,0), 1.8)

# 3) bordes húmedos: pigmento acumulado en el contorno de cada mancha
edge = np.zeros((H,W),np.float32)
edge[:,1:] += (lbl[:,1:]!=lbl[:,:-1]); edge[1:,:] += (lbl[1:,:]!=lbl[:-1,:])
edge = cv2.GaussianBlur(np.clip(edge,0,1),(0,0),1.3)
edge = np.clip(edge*2.2,0,1)[...,None]
paint = paint*(1-0.1*edge)

# 4) floraciones (blooms) y granulado
bloom = noise(110)[...,None]; grain = noise(3,2)[...,None]
paint = paint*(0.95+0.09*bloom)*(0.965+0.05*grain)

# 5) tinta fina, sólo trazos principales
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
sk = 1 - np.clip(g/(cv2.GaussianBlur(g,(0,0),5)+1),0,1)
sk = np.clip((sk-0.06)*5,0,1)
sk = cv2.GaussianBlur(sk,(0,0),0.6)[...,None]
ink = np.array([70,88,112],np.float32)
paint = paint*(1-0.32*sk) + ink*0.32*sk

# 6) borde irregular sobre papel marfil, con blancos sin pintar
yy,xx = np.mgrid[0:H,0:W].astype(np.float32)
d = np.maximum(np.abs(xx-W/2)/(W/2), np.abs(yy-H/2)/(H/2)) + (noise(120)-0.5)*0.16
mask = np.clip((0.96-d)/0.16,0,1)
mask = cv2.GaussianBlur(mask,(0,0),2.2)[...,None]
paper = np.array([237,245,248],np.float32)*(0.97+0.04*grain)
out = paint*mask + paper*(1-mask)
cv2.imwrite(sys.argv[2], np.clip(out,0,255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 84])
