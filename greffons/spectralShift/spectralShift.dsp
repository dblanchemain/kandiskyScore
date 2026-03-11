// ------------------------------------------
// Spectral Shift + Bandpass WAM2 Faust
// ------------------------------------------
import("stdfaust.lib");
ef = library("misceffects.lib");

// -------------------- Paramètres --------------------
fftSize = 2048;
hopSize = fftSize/4;

// Spectral shift (en bins, peut être positif ou négatif)
binShift = hslider("Spectral Shift (bins)", 0, -1024, 1024, 1);

// Bandpass (Fréquence haute/basse)
Fl = hslider("Bandpass Low", 500, 20, 20000, 1);
Fh = hslider("Bandpass High", 3000, 20, 20000, 1);

// -------------------- Traitement --------------------
// Note : stft / istft fait partie de an.* en Faust 2.59.1
// si non dispo, remplacer par fft/ifft + overlap-add

spectralShiftBlock(sig) = sig
    : an.fft(fftSize)
    : par(i, fftSize/2, shiftBins(i))
    : an.ifft(fftSize)
    : an.overlapAdd(fftSize, hopSize);

shiftBins(k, re, im) =
    (re', im') with {
        re' = select2(k + int(binShift) >= 0 & k + int(binShift) < fftSize/2,
                      0,
                      re@(k + int(binShift)));
        im' = select2(k + int(binShift) >= 0 & k + int(binShift) < fftSize/2,
                      0,
                      im@(k + int(binShift)));
    };

// Bandpass sur la sélection
bandpass(sig) = fi.highpass(3, Fl) : fi.lowpass(3, Fh);

// -------------------- Process --------------------
process = _ 
        : spectralShiftBlock
        : bandpass;
