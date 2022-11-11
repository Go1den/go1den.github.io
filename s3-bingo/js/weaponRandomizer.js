class WeaponRandomizer {
    constructor(bingoBoard, seed, isUsingAllWeapons, isAllowingRepeats, isIgnoreSeed) {
        this.weaponMap = bingoBoard.weaponMap;
        this.board = bingoBoard.board;
        this.seed = seed;
        this.isIgnoreSeed = isIgnoreSeed;
        this.isUsingAllWeapons = isUsingAllWeapons;
        this.isAllowingRepeats = isAllowingRepeats;
        this.pool = this.setupPool();
        this.index = -1;
    }

    getLength() {
        return this.pool.length;
    }

    getWeaponNumber() {
        return this.index+1;
    }

    nextWeapon() {
        if (this.index >= this.pool.length) {
            return null;
        } else {
            this.index += 1;
            return this.pool[this.index];
        }
    }

    previousWeapon() {
        if (this.index <= 0) {
            return null;
        } else {
            this.index -= 1;
            return this.pool[this.index];
        }
    }

    #getAllWeapons() {
        let result = [];
        let mapKeys = Array.from(this.weaponMap.keys());
        for (let key in mapKeys) {
            let value = this.weaponMap.get(mapKeys[key]);
            for (let val in value) {
                result.push(value[val]);
            }
        }
        return result;
    }

    //This is called during construction, but can also be called to rerun the generation, say after calling setSeed to change the rng.
    setupPool() {
        this.index = -1;
        if (this.isIgnoreSeed) {
            Math.seedrandom();
        } else {
            console.log(this.seed);
            Math.seedrandom(this.seed);
        }
        let tempPool;
        if (this.isUsingAllWeapons) {
            tempPool = this.#getAllWeapons();
        } else {
            tempPool = this.board.slice();
        }
        let result;
        if (this.isAllowingRepeats) {
            result = new Array(1000);
            for(let i=0; i<1000; i++) {
                let index = Math.floor(Math.random() * tempPool.length);
                result[i] = tempPool[index];
            }
        } else {
            result = new Array(tempPool.length);
            for(let i=0; i<tempPool.length; i++) {
                let index = Math.floor(Math.random() * tempPool.length);
                result[i] = tempPool[index];
                tempPool.slice(index, 1);
            }
        }
        return result;
    }


}