const operations = ["+", "-", "*", "/", "**"];
const numbers = ["4", "2", "0.4", "24"];
const parentheses = [[{//(4+4+4+4)
	from: 0,
	end: 3
}], [{//(4+4)*(4+4)
	from: 0,
	end: 1
}, {
	from: 2,
	end: 3
}
], [{//(4+4+4)*4)
	from: 0,
	end: 2
}, {
	from: 3,
	end: 3
}
], [{//(4)/(4+4+4)
	from: 0,
	end: 0
}, {
	from: 1,
	end: 3
}
], [{//(4)+(4+4)/(4)
	from: 0,
	end: 0
}, {
	from: 1,
	end: 2
}, {
	from: 3,
	end: 3
}
]];

var results = [["4+4+4+4", 16]];

function nextOffset(arr, length) {
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i] < length - 1) {
			arr[i]++;
			for (var j = i + 1; j < arr.length; j++) {
				arr[j] = 0;
			}
			return;
		}
	}
}

function arrayEquals(arrA, arrB) {
	if (arrA.length != arrB.length) return false;
	for (var i = 0; i < arrA.length; i++) {
		if (arrA[i] != arrB[i]) return false;
	}
	return true;
}

function isInteger(nb) {
	if (/*Math.round(nb)*/nb == nb) return true;
	return false;
}

class Calc {
	constructor() {
		this.parState = 0;
		this.opOffsets = [0, 0, 0];
		this.nbOffsets = [0, 0, 0, 0];


		this.par = parentheses[this.parState];

		this.ops = [];
		this.nbs = [];

		this.redefine();

		this.calc();
	}

	calc() {
		this.calcul = "";
		//this.calcul = this.nbs[0] + this.ops[0] + this.nbs[1] + this.ops[1] + this.nbs[2] + this.ops[2] + this.nbs[3];
		this.createCalc();


		//console.log(this.calcul + ":");

		this.result = eval(this.calcul);
		this.result = this.result.toFixed(12);
		//console.log(this.result);
	}

	createCalc() {
		for (var i = 0; i < this.nbs.length; i++) {
			if (this.startPar(i)) {
				this.calcul += "(";
			}

			this.calcul += this.nbs[i];

			if (this.endPar(i)) {
				this.calcul += ")";
			}

			if (i < this.ops.length) {
				this.calcul += this.ops[i]
			}
		}
		//console.log(this.calcul);
	}

	startPar(j) {
		for (var i = 0; i < this.par.length; i++) {
			if (this.par[i].from == j) return true;
		}
		return false;
	}

	endPar(j) {
		for (var i = 0; i < this.par.length; i++) {
			if (this.par[i].end == j) return true;
		}
		return false;
	}

	next() {
		if (this.parState < parentheses.length - 1) {
			this.parState++;
		} else if (!arrayEquals(this.opOffsets, [operations.length - 1, operations.length - 1, operations.length - 1])) {
			nextOffset(this.opOffsets, operations.length);
			this.parState = 0;
		} else {
			this.parState = 0;
			this.opOffsets = [0, 0, 0];
			nextOffset(this.nbOffsets, numbers.length);
		}

		this.redefine();
	}

	redefine() {
		for (var i = 0; i < this.opOffsets.length; i++) {
			this.ops[i] = operations[this.opOffsets[i]];
		}
		for (var i = 0; i < this.nbOffsets.length; i++) {
			this.nbs[i] = numbers[this.nbOffsets[i]];
		}
		this.par = parentheses[this.parState];

		this.calc();
	}
}

function isDone() {
	if ((arrayEquals(n.opOffsets, [operations.length - 1, operations.length - 1, operations.length - 1]) && arrayEquals(n.nbOffsets, [numbers.length - 1, numbers.length - 1, numbers.length - 1, numbers.length - 1]))) {
		return false;
	}
	return true;
}

console.log("calculating...");

var n = new Calc();
//console.log(n);

for (var j = 0; isDone(); j++) {

	n.next();
	//console.log(n);

	if (isInteger(n.result) && n.result >= 0) {
		results.push(
			[n.calcul, Math.abs(n.result)]
		)
	}

}


var resl = {};

for (var j = 0; j < results.length; j++) {
	if (resl[results[j][1]] == undefined) {
		resl[results[j][1]] = 1;
	} else {
		resl[results[j][1]]++;
	}
}

console.log(resl);

const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });

readline.question(`Which number?`, (val) => {
	for (var i = 0; i < results.length; i++) {
		if (val == results[i][1]) console.log(results[i]);
	}
});
