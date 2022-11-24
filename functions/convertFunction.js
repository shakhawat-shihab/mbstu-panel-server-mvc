exports.idCodeToDept = (s) => {
    if (s.startsWith('ce')) {
        return "cse";
    }
    else if (s.startsWith('it')) {
        return "ict";
    }
    else if (s.startsWith('te')) {
        return "te";
    }
    else if (s.startsWith('me')) {
        return "me";
    }
    else if (s.startsWith('er')) {
        return "esrm";
    }
    else if (s.startsWith('fn')) {
        return "ftns";
    }
    else if (s.startsWith('bg')) {
        return "bge";
    }
    else if (s.startsWith('bmb')) {
        return "bmb";
    }
    else if (s.startsWith('pha')) {
        return "phar";
    }
    else if (s.startsWith('ch')) {
        return "chem";
    }
    else if (s.startsWith('ma')) {
        return "math";
    }
    else if (s.startsWith('ph')) {
        return "phy";
    }
    else if (s.startsWith('st')) {
        return "stat";
    }
    else if (s.startsWith('bba')) {
        return "bba";
    }
    else if (s.startsWith('ac')) {
        return "acc";
    }
    else if (s.startsWith('mgt')) {
        return "mng";
    }
    else if (s.startsWith('eco')) {
        return "eco";
    }
    else if (s.startsWith('eng')) {
        return "eng";
    }
}