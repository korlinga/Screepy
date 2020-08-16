var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.name.startsWith('Harvester') && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.role = 'harvester';
        }
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
			//creep.memory.role = 'harvester';
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			else
			{
				console.log('nothing to build');
			}
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
			//if creep does not have a destination var sources already reserved in memory
			if(!creep.memory.reservations)
			{
				//grab a random source from the room
				const random = Math.floor(Math.random() * sources.length);
				//store the random source into memory
				creep.memory.reservations = sources[random].pos;
				console.log('role.builder DEBUG - ' + creep.name + ' stored location at ' + sources[random].pos.x + ',' + sources[random].pos.y);//DEBUG
			}
			else
			{
				MoveToThing();
			}
	    } 
		function MoveToThing()
		{
			var xInRange = _.inRange(creep.pos.x, creep.memory.reservations.x-1, creep.memory.reservations.x+2);
			console.log(creep.name + xInRange);
			var yInRange = _.inRange(creep.pos.y, creep.memory.reservations.y-1, creep.memory.reservations.y+2);
			//if the creep is within range (-1 to +1.1 [non-inclusive]) as the reserved location AND in the same room
			if(xInRange == true && yInRange == true && creep.room.name == creep.memory.reservations.roomName)
			{
				//find the closest source
				console.log(creep.name + ' is pretty close to the source');
				const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
				//if source is identified
				if(target) {
					//try to harvest; if cannot reach it then
					if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
						//error out
						console.log('cant MineTheThing()');
						//clear memory
						creep.memory.reservations = '';
					}
				}
			}
			// if the creep is not at the same position as the reserved location
			else
			{
				//create a destination from the creep's memory location
				//and move to it
				const destinationPos = new RoomPosition(creep.memory.reservations.x, creep.memory.reservations.y, creep.memory.reservations.roomName);
				creep.moveTo(destinationPos, {visualizePathStyle: {stroke: '#ffaa00'}});
			}
		}
	}
};

module.exports = roleBuilder;