var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		// if the creep was a named harvester, switch the role back if it 0 capacity
		if(creep.name.startsWith('Harvester') && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.role = 'harvester';
        }
		// if the creep building trigger is true AND the creep has 0 resources left,
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			// turn off the building trigger in memory
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
		//if the creep building trigger is false AND the creep is full
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			// turn on the building trigger
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }
		// if the building trigger is TRUE
	    if(creep.memory.building) {
			// find available construction sites in the room
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			// if there are some
            if(targets.length) {
				// go build the first one in the array
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			// if there are no available construction sites
			else
			{	
				//disable the build trigger
				creep.memory.build = false;
				// switch the creep to the harvester role
				creep.memory.role = 'harvester';
				console.log('nothing to build...' + creep.name + ' switched to ' + creep.memory.role );
			}
	    }
		// if the building trigger is false (and your not a harvester for some reason)
	    else {
			// find a container
	        var containers = creep.room.find(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER);
					}
				});
			//if there are no containers
			if (containers.length == 0){
				//become a harvester anyhow
				creep.memory.role = 'harvester';
			}
			//if there are containers
			else 
			{
				//if creep does not have a destination var reservations already reserved in memory
				if(!creep.memory.reservations)
				{
					//grab a random container from the room
					const random = Math.floor(Math.random() * containers.length);
					//store the random source into memory
					creep.memory.reservations = containers[random].pos;
					console.log('role.builder DEBUG - ' + creep.name + ' stored location at ' + containers[random].pos.x + ',' + containers[random].pos.y);//DEBUG
				}
				else
				{
					MoveToThing();
				}	
			}
	    } 
		function MoveToThing()
		{
			var xInRange = _.inRange(creep.pos.x, creep.memory.reservations.x-1, creep.memory.reservations.x+2);
			var yInRange = _.inRange(creep.pos.y, creep.memory.reservations.y-1, creep.memory.reservations.y+2);
			//if the creep is within range (-1 to +1.1 [non-inclusive]) as the reserved location AND in the same room
			if(xInRange == true && yInRange == true && creep.room.name == creep.memory.reservations.roomName)
			{
				//find the closest container
				const target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER);
					}
				});
				//if source is identified
				if(target) {
					//try to withdraw; if cannot reach it then
					if(creep.withdraw(target) == ERR_NOT_IN_RANGE) {
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