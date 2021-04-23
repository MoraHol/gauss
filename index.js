const csv = require('csv-parser');
const fs = require('fs');
const gaussResult = require('gaussian-elimination')
const fastcsv = require('fast-csv');

const iteraciones = []
validateMatrix = function (array) {
    if (array.length > 1) {
        if (array.length > array[0].length) {
            throw new Error("se ecuentran mas filas que columnas")
        } else if (array.length === array[0].length) {
            throw new Error("se ecnuentran los mismos numero de columnas")
        }
    }
}


gauss = (array) => {
    console.log(array)
    const result = gaussResult(array)
    result.forEach((r, index) => {
        console.log(`x${index + 1} = ${r}`)
    })

}
escogerFilaAuxiliar = (matrix, i, j) => {
    const jModificado = j - 1;
    for (let j = jModificado; j >= 0; j--) {
        if (matrix[j][i] !== 0) {
            return matrix[j];
        }
    }
}


operarFila = (filaAuxiliar, valorActual, valActFilAux, filaAModificar) => {
    let aux = [...filaAuxiliar];
    for (let j = 0; j < aux.length; j++) {
        aux[j] = filaAModificar[j] - (aux[j] * (valorActual / valActFilAux));
    }
    return aux;
}

ejecutar = (numeros) => {
    let matrix = [...numeros];
    let iteracion = 0;
    // console.log(`iteracion ${iteracion}`, matrix)
    // iteraciones.push({data: [...matrix], iteracion});

    for (let i = 0; i < matrix[0].length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (i < j && matrix[j][i] !== 0) {
                let aux = escogerFilaAuxiliar(matrix, i, j);
                matrix[j] = operarFila(aux, matrix[j][i], aux[i], matrix[j]);
                matrix[j][i] = 0;
                // console.log(`iteracion ${iteracion += 1}`, matrix)
                iteraciones.push(matrix)
            }
        }
    }
    return iteraciones;
}


const array = []
fs.createReadStream('data1.csv')
    .pipe(csv({
        headers: false, strict: true, mapValues: (args =>
                Number(args.value)
        )
    }))
    .on('data', (row) => {
        // console.log(row);
        array.push(Object.values(row));
        // console.log(Object.values(row))
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        console.log(`matriz leida =>`, array);
        validateMatrix(array)
        console.log(`matriz de ${array.length} * ${array[0].length}`)
        const iter = ejecutar(array)
        iter.splice(-1).forEach((r, index) => {
            console.log(`iteracion ${iter.length - (index + 1)}`, r)
            const ws = fs.createWriteStream(`out${iter.length - (index + 1)}.csv`);
            r.forEach(s => {
                ws.write(s.map(x => x.toFixed(2)).join(','))
                ws.write('\n')
            })

        })
        gauss(array)
    }).on('error', (err => {
    console.error(err)
}));


