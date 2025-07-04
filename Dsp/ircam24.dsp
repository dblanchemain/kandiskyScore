declare name        "ircam24";
declare version     "1.0";
declare author      "D.Blanchemain";
declare license     "BSD";
declare copyright   "(c)D.Blanchemain 2023";
import("stdfaust.lib");
Matrix(N,M) =_<: par(out, M, *(Fader(1,out): si.smoo)) :> par(out, M, _)
with {
tabSpeakerX(0)=0.01;
tabSpeakerY(0)=-0.6;
tabSpeakerZ(0)=1;
tabSpeakerD(0)=1.17;
tabSpeakerX(1)=0.77;
tabSpeakerY(1)=-0.6;
tabSpeakerZ(1)=0.6;
tabSpeakerD(1)=1.15;
tabSpeakerX(2)=1;
tabSpeakerY(2)=-0.6;
tabSpeakerZ(2)=0;
tabSpeakerD(2)=1.17;
tabSpeakerX(3)=0.78;
tabSpeakerY(3)=-0.6;
tabSpeakerZ(3)=-0.6;
tabSpeakerD(3)=1.15;
tabSpeakerX(4)=0.28;
tabSpeakerY(4)=-0.6;
tabSpeakerZ(4)=-0.88;
tabSpeakerD(4)=1.10;
tabSpeakerX(5)=-0.3;
tabSpeakerY(5)=-0.6;
tabSpeakerZ(5)=-0.88;
tabSpeakerD(5)=1.11;
tabSpeakerX(6)=-0.77;
tabSpeakerY(6)=-0.6;
tabSpeakerZ(6)=-0.6;
tabSpeakerD(6)=1.15;
tabSpeakerX(7)=-1;
tabSpeakerY(7)=-0.6;
tabSpeakerZ(7)=0;
tabSpeakerD(7)=1.17;
tabSpeakerX(8)=-0.77;
tabSpeakerY(8)=-0.6;
tabSpeakerZ(8)=0.6;
tabSpeakerD(8)=1.15;
tabSpeakerX(9)=0.16;
tabSpeakerY(9)=-0.22;
tabSpeakerZ(9)=0.61;
tabSpeakerD(9)=0.67;
tabSpeakerX(10)=0.69;
tabSpeakerY(10)=-0.22;
tabSpeakerZ(10)=0.17;
tabSpeakerD(10)=0.74;
tabSpeakerX(11)=0.69;
tabSpeakerY(11)=-0.22;
tabSpeakerZ(11)=-0.37;
tabSpeakerD(11)=0.81;
tabSpeakerX(12)=0.36;
tabSpeakerY(12)=-0.22;
tabSpeakerZ(12)=-0.63;
tabSpeakerD(12)=0.76;
tabSpeakerX(13)=0;
tabSpeakerY(13)=-0.22;
tabSpeakerZ(13)=-0.7;
tabSpeakerD(13)=0.73;
tabSpeakerX(14)=-0.35;
tabSpeakerY(14)=-0.22;
tabSpeakerZ(14)=-0.64;
tabSpeakerD(14)=0.76;
tabSpeakerX(15)=-0.69;
tabSpeakerY(15)=-0.22;
tabSpeakerZ(15)=-0.35;
tabSpeakerD(15)=0.80;
tabSpeakerX(16)=-0.7;
tabSpeakerY(16)=-0.22;
tabSpeakerZ(16)=0.17;
tabSpeakerD(16)=0.75;
tabSpeakerX(17)=-0.37;
tabSpeakerY(17)=-0.22;
tabSpeakerZ(17)=0.6;
tabSpeakerD(17)=0.74;
tabSpeakerX(18)=-0.01;
tabSpeakerY(18)=0.4;
tabSpeakerZ(18)=0.35;
tabSpeakerD(18)=0.53;
tabSpeakerX(19)=0.34;
tabSpeakerY(19)=0.4;
tabSpeakerZ(19)=-0.01;
tabSpeakerD(19)=0.53;
tabSpeakerX(20)=-0.01;
tabSpeakerY(20)=0.4;
tabSpeakerZ(20)=-0.36;
tabSpeakerD(20)=0.54;
tabSpeakerX(21)=-0.35;
tabSpeakerY(21)=0.4;
tabSpeakerZ(21)=-0.01;
tabSpeakerD(21)=0.53;
tabSpeakerX(22)=0;
tabSpeakerY(22)=1;
tabSpeakerZ(22)=0;
tabSpeakerD(22)=1.00;
dtencGen(in, out) = sqrt(pow(tabSpeakerX(out)-x(in),2) + pow(tabSpeakerY(out)+y(in),2) + pow(tabSpeakerZ(out)-z(in),2));
hspot = hslider("Hot Spot",-20,-50,0,1);
dgain(in, out) = ba.db2linear((hspot/tabSpeakerD(out))*dtencGen(in,out));
x(i) = hslider("/X%i",0,-1,1,0.01);
y(i) = hslider("/Y%i",0,-1,1,0.01);
z(i) = hslider("/Z%i",0,-1,1,0.01);
Fader(in,out)= vgroup("[1]Input %2in",dgain(in,out)*cdistance);
cdistance(in)=hslider("dt",1,0,1,0.1):si.smoo;
paramDistance(x)=hgroup("[2]Distance",x);
};
process =_,_:> Matrix(1,23);
