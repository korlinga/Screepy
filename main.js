var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawn = require('role.spawn');

module.exports.loop = function () {
    var Spawn1 = "Spawn1";
	var Room1 = "E24S1";
    //clear memory of dead things names
        for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

//-=Creep Spawns=-
		//var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	// (1/2) identify available creeps by name
    var harvesters = _.filter(Game.creeps,(creep) => creep.name.startsWith('Harvester'));	
		//console.log('Harvesters: ' + harvesters.length);
		//var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var builders = _.filter(Game.creeps,(creep) => creep.name.startsWith('Builder'));
		//console.log('Builders: ' + builders.length);
		//var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var upgraders = _.filter(Game.creeps,(creep) => creep.name.startsWith('Upgrader'));
		//console.log('Upgraders: ' + upgraders.length);
		//var claimers = _.filter(Game.creeps,(creep) => creep.name.startsWith('Claimer'));
    // (2/2) if there are less than allowed amount, spawn the screep
		//TODO associate hardcoded number of creeps to something else (creep-inventory-module?)
    if(harvesters.length < 1) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[Spawn1].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    } else if(builders.length < 5) {
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
    /*
	Create a flag named "MiningFlag x,y" at every plain spot next to a minable source
		+ Only creates flags on plains
		+ If the flag already exists, it does not build a new one
		+ harvester's use the startsWith() function to reserve these flags
	*/
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
	
	//Controller Level Check
	var controllerLevel = Game.spawns[Spawn1].room.controller.level;
	//run level tracking function
	Game.spawns.Spawn1.memory.controllerlevel = controllerLevel;
	//Testing memory write to game spawn memory write (IT WORKED)
	//console.log('aaaaa' + Game.spawns[Spawn1].memory.controllerlevel);
	// check if global memory value exists
	
		// if it does, compare lvl against value
			// if lvl < value
			// run constructionSites()
			// lvl == value
		// if it does not, lvl == value
	//ContstructionLevelTracking(controllerLevel);
	
	function ContstructionLevelTracking(lvl)
	{
		console.log('My controller lvl is ' + lvl);
		if (lvl >= 0)
		{
			ConstructionSites('Roads');
			console.log('Activate 5 ConstructionSites(Containers)');
		}
		if (lvl >= 1)
		{
			console.log('Activate ConstructionSites(Spawn)');	
		}
		if (lvl >= 2)
		{
			console.log('Activate 5 ConstructionSites(Extensions)');
			console.log('Activate the ConstructionSites(Ramparts)');
			console.log('Activate the ConstructionSites(Walls)');
		}
		if (lvl >= 3)
		{
			console.log('yay, lvl 3');
		}
	}
	
	/*
	function ConstructionSites_Roads()
	{
		const path = spawn.pos.findPathTo(source);	//identify path from spawn to source
		Memory.path = Room.serializePath(path);		//write the path to global memory
		//creep.moveByPath(Memory.path); 	//an example of how creeps will use this to move
		//for each item in the array, build a construction site
		Game.rooms.sim.createConstructionSite(10, 15, STRUCTURE_ROAD);	//set construction sites 
	}
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
	//call spawn roles
    for(var eachSpawn in Game.spawns) {
        var spawn = Game.spawns[eachSpawn].name;
        roleSpawn.run(spawn);
    }
}