function loopNestedObj(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            loopNestedObj(obj[key]);
        } else {
            obj[key] = processValue(obj[key]);
        }
    }
    return obj;
}

function processValue(value) {
    if (value === null || value === undefined) {
        return '';
    } else if (Number.isNaN(value) || value === 'NaN') {
        return '';
    } else {
        return value;
    }
}

function nullSafely(obj) {
    return loopNestedObj(obj);
}

module.exports = nullSafely;
