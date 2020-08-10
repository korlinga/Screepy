var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    //var Spawn1 = "Spawn1";
	// get my spawns
	for(const i in Game.spawns)
	{
		var a = Game.spawns[i].name;
	}
	var Spawn1 = a;
	var Room1 = "E24S1";
    //clear memory of dead things names
        for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //spawn the things
    //var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var harvesters = _.filter(Game.creeps,(creep) => creep.name.startsWith('Harvester'));
    //console.log('Harvesters: ' + harvesters.length);
    //var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var builders = _.filter(Game.creeps,(creep) => creep.name.startsWith('Builder'));
    //console.log('Builders: ' + builders.length);
    //var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var upgraders = _.filter(Game.creeps,(creep) => creep.name.startsWith('Upgrader'));
    //console.log('Upgraders: ' + upgraders.length);
    
    if(harvesters.length < 6) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[Spawn1].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    } else if(builders.length < 0) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[Spawn1].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder'}});
    } else if(upgraders.length < 1) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns[Spawn1].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
    
    if(Game.spawns[Spawn1].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns[Spawn1].spawning.name];
        Game.spawns[Spawn1].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[Spawn1].pos.x + 1, 
            Game.spawns[Spawn1].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    // find sources
    const MiningHoles = Game.spawns[Spawn1].room.find(FIND_SOURCES);
	const terrain = Game.map.getRoomTerrain(Room1);
    // for every hole found
    for (var x in MiningHoles)
    {
        //console.log(MiningHoles[x].pos.x + ' , ' + MiningHoles[x].pos.y);
		//build an array of positions around each hole
		var flagPoleHoleCheck = [];
		var flagHole = [];
		flagPoleHoleCheck.push([MiningHoles[x].pos.x,MiningHoles[x].pos.y+1]);
		flagPoleHoleCheck.push([MiningHoles[x].pos.x,MiningHoles[x].pos.y-1]);
		flagPoleHoleCheck.push([MiningHoles[x].pos.x-1,MiningHoles[x].pos.y]);
		flagPoleHoleCheck.push([MiningHoles[x].pos.x-1,MiningHoles[x].pos.y+1]);
		flagPoleHoleCheck.push([MiningHoles[x].pos.x-1,MiningHoles[x].pos.y-1]);
		flagPoleHoleCheck.push([MiningHoles[x].pos.x+1,MiningHoles[x].pos.y]);
		flagPoleHoleCheck.push([MiningHoles[x].pos.x+1,MiningHoles[x].pos.y+1]);
		flagPoleHoleCheck.push([MiningHoles[x].pos.x+1,MiningHoles[x].pos.y-1]);
		//console.log(flagPoleHoleCheck);
		//for each item in flagPoleHoleCheck, fill in the pos
		for (var z in flagPoleHoleCheck){
			switch(terrain.get(flagPoleHoleCheck[z][0],flagPoleHoleCheck[z][1])) {
				case TERRAIN_MASK_WALL:
					break;
				case TERRAIN_MASK_SWAMP:
					break;
				case 0:
					flagHole.push(flagPoleHoleCheck[z]);
					break;
			}
		}
		for (var hole in flagHole)
		{
			switch(Game.spawns[Spawn1].room.createFlag(flagHole[hole][0],flagHole[hole][1], 'MiningLocation ' + flagHole[hole]))
			{
				case -3:
					testing = 'ERR_NAME_EXISTS error';
					break;
				case -8:
					testing = 'ERR_FULL error';
					break;
				case -10:
					testing = 'ERR_INVALID_ARGS error';
					break;
			}
		}
    }
	console.log('MY LEVEL IS ' + Game.spawns[Spawn1].room.controller.level);
	
    
    //TODO - build construction projects on controller level up//
    /*
    const extensions = Game.spawns[Spawn1].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    console.log(Spawn1 + ' has '+extensions.length+' extensions available');
	console.log(Room.controller + ' Selfie ');
	*/
	
    //tower behavior
    /*
    var tower = Game.getObjectById('b77671ebce84fbd7545a84c5');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    */
    //call creep roles
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}