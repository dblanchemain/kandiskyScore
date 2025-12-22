ba = library("basics.lib");
ef = library("misceffects.lib");
import("stdfaust.lib");

filters=vgroup("FILTERS",ba.bypass1(fbp,hgroup("[1]",nHPF:nLPF))) with {
	nLPF=fi.lowpass(3,lfc)
	with {
		lfc=vslider("LPF Freq",1000, 20, 20000, 1);
	};
	nHPF=fi.highpass(3,hfc)
		with {
		hfc=vslider("HPF Freq",20, 20, 20000, 1);
	};
	fbp = checkbox("[0] Bypass  [tooltip: When this is checked, the filters
		has no effect]");
};
process = filters;
