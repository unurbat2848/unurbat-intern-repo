// example of poorly named variables?

function x(a, b) {
    let c = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] > b) {
            c += a[i];
        }
    }
    let d = [];
    for (let j = 0; j < a.length; j++) {
        if (a[j] % 2 === 0) {
            d.push(a[j]);
        }
    }
    let e = d.map(f => f * 2);
    return {c, e};

}