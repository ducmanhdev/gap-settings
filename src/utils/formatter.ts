export const usePhoneFormat = (value: number | string) => {
    const input = value.toString().replace(/\D/g, '').substring(0, 10);
    const areaCode = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);
    if (input.length > 6) {
        return `(${areaCode}) ${middle} - ${last}`;
    }
    if (input.length > 3) {
        return `(${areaCode}) ${middle}`;
    }
    if (input.length > 0) {
        return `(${areaCode}`;
    }
    return '';
}

export const usePhoneParser = (value: number | string) => {
    const replacedValue = value.toString().replace(/\D/g, '');
    if (replacedValue === '') return '';
    return Number(replacedValue);
}

export const useNumberToPercentageFormat = (value: number, fixedValue = 2): string => {
    const firstNum = Number((value * 100).toFixed(fixedValue));
    const lastNum = parseFloat((100 - firstNum).toFixed(fixedValue));
    return `${firstNum} - ${lastNum}`
};

export const currencyFormat = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    }).format(value)
}
