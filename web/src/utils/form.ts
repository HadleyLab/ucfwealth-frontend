import _ from 'lodash';

function isEmpty(value: any) {
    return value == null || _.isEqual(value, {}) || _.isEqual(value, []);
}

export function removeEmptyValues(obj: any): any {
    if (_.isArray(obj)) {
        return _.chain(obj).map(removeEmptyValues).reject(isEmpty).value();
    }

    if (_.isPlainObject(obj)) {
        return _.chain(obj)
            .toPairs()
            .map(([key, value]) => [key, removeEmptyValues(value)])
            .reject(([key, value]) => isEmpty(value))
            .fromPairs()
            .value();
    }

    return obj;
}

export function trimWhitespaces(obj: any): any {
    if (_.isString(obj)) {
        if (!/\S/.test(obj)) {
            return undefined;
        }
        return _.trim(obj);
    }

    if (_.isArray(obj)) {
        return _.map(obj, trimWhitespaces);
    }

    if (_.isPlainObject(obj)) {
        return _.mapValues(obj, trimWhitespaces);
    }

    return obj;
}
