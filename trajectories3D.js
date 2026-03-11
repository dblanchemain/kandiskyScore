// trajectories3D.js

// === UTILITAIRES DE ROTATION ===
function rotateX(x, y, z, angle) {
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    return [x, y*cosA - z*sinA, y*sinA + z*cosA];
}
function rotateY(x, y, z, angle) {
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    return [x*cosA + z*sinA, y, -x*sinA + z*cosA];
}
function rotateZ(x, y, z, angle) {
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    return [x*cosA - y*sinA, x*sinA + y*cosA, z];
}
//radius = amplitude du mouvement autour du centre
// === SPIRALE ===
function trajectorySpirale(nPoints=100, radius=1, height=1, turns=2, rotX=0, rotY=0, rotZ=0) {
    const spX=[], spY=[], spZ=[], spT=[];
    for(let i=0;i<nPoints;i++){
        const t = i/(nPoints-1);
        let x = radius*Math.cos(2*Math.PI*turns*t);
        let y = radius*Math.sin(2*Math.PI*turns*t);
        let z = height*t;
        [x,y,z] = rotateX(...[x,y,z,rotX]);
        [x,y,z] = rotateY(...[x,y,z,rotY]);
        [x,y,z] = rotateZ(...[x,y,z,rotZ]);
        spX.push(x); spY.push(y); spZ.push(z); spT.push(t);
    }
    return { spT, spX, spY, spZ };
}

// === ORBITE CIRCULAIRE ===
function trajectoryOrbite(nPoints=100, radius=1, axis='Z', rotX=0, rotY=0, rotZ=0) {
    const spX=[], spY=[], spZ=[], spT=[];
    for(let i=0;i<nPoints;i++){
        const t = i/(nPoints-1);
        const angle = 2*Math.PI*t;
        let x=0,y=0,z=0;
        if(axis==='Z'){ x = radius*Math.cos(angle); y = radius*Math.sin(angle); z=0; }
        else if(axis==='X'){ x=0; y = radius*Math.cos(angle); z = radius*Math.sin(angle); }
        else if(axis==='Y'){ x = radius*Math.cos(angle); y=0; z = radius*Math.sin(angle); }
        [x,y,z] = rotateX(x,y,z,rotX);
        [x,y,z] = rotateY(x,y,z,rotY);
        [x,y,z] = rotateZ(x,y,z,rotZ);
        spX.push(x); spY.push(y); spZ.push(z); spT.push(t);
    }
    return { spT, spX, spY, spZ };
}

// === CERCLE === (similaire orbite mais isolé pour vertical/horizontal)
function trajectoryCercle(nPoints=100, radius=1, axis='Z', rotX=0, rotY=0, rotZ=0) {
    return trajectoryOrbite(nPoints,radius,axis,rotX,rotY,rotZ);
}

// === ZIGZAG 3D ===
function trajectoryZigzag(nPoints=100, amplitude=1, freq=4, rotX=0, rotY=0, rotZ=0) {
    const spX=[], spY=[], spZ=[], spT=[];
    for(let i=0;i<nPoints;i++){
        const t = i/(nPoints-1);
        let x = amplitude * Math.sin(2*Math.PI*freq*t);
        let y = amplitude * Math.cos(2*Math.PI*freq*t);
        let z = amplitude * Math.sin(4*Math.PI*t);
        [x,y,z] = rotateX(x,y,z,rotX);
        [x,y,z] = rotateY(x,y,z,rotY);
        [x,y,z] = rotateZ(x,y,z,rotZ);
        spX.push(x); spY.push(y); spZ.push(z); spT.push(t);
    }
    return { spT, spX, spY, spZ };
}

// === OSCILLATION 3D ===
function trajectoryOscillation(nPoints=100, amplitude=1, freqX=1, freqY=2, freqZ=3, rotX=0, rotY=0, rotZ=0) {
    const spX=[], spY=[], spZ=[], spT=[];
    for(let i=0;i<nPoints;i++){
        const t = i/(nPoints-1);
        let x = amplitude * Math.sin(2*Math.PI*freqX*t);
        let y = amplitude * Math.sin(2*Math.PI*freqY*t);
        let z = amplitude * Math.sin(2*Math.PI*freqZ*t);
        [x,y,z] = rotateX(x,y,z,rotX);
        [x,y,z] = rotateY(x,y,z,rotY);
        [x,y,z] = rotateZ(x,y,z,rotZ);
        spX.push(x); spY.push(y); spZ.push(z); spT.push(t);
    }
    return { spT, spX, spY, spZ };
}
function trajectorySpiraleConique(
    nPoints = 100, 
    radius = 1, 
    height = 2, 
    turns = 3, 
    direction = 'up', // 'up' ou 'down'
    rotX = 0, rotY = 0, rotZ = 0
) {
    const spX = [], spY = [], spZ = [], spT = [];
    for (let i = 0; i < nPoints; i++) {
        const t = i / (nPoints - 1);
        const angle = 2 * Math.PI * turns * t;
        
        // calcul du rayon variable (0 -> radius pour 'down', radius -> 0 pour 'up')
        let r = direction === 'up' ? radius * (1 - t) : radius * t;

        let x = r * Math.cos(angle);
        let y = r * Math.sin(angle);
        let z = direction === 'up' ? height * t : height * (1 - t);

        // applique rotation pour inclinaison du plan
        [x, y, z] = rotateX(x, y, z, rotX);
        [x, y, z] = rotateY(x, y, z, rotY);
        [x, y, z] = rotateZ(x, y, z, rotZ);

        spX.push(x);
        spY.push(y);
        spZ.push(z);
        spT.push(t);
    }
    return { spT, spX, spY, spZ };
}
