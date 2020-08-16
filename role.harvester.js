var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
		
		//if creep has free capacity
	    if(creep.store.getFreeCapacity() > 0) {
			//if creep does not have a Mining flag reserved in memory
			if (!creep.memory.reservations)
			{
				//run the flag reservation function
				ReserveMyFlag();
			}
			//if the creep is already at the reserved flag
			if(creep.pos.x == creep.memory.reservations.x && creep.pos.y == creep.memory.reservations.y && creep.room.name == creep.memory.reservations.roomName) 
			{
				//start mining the closest source using the appropriate function
				MineTheThing();
			}
			//if the creep is not at the reserved flag
			else 
			{
				//go to the reserved flag  using the appropriate function
				MoveToFlag();
			}
		}
		else // if the creep is full
		{
			//if I am originally something else, switch my role back
			if (creep.name.startsWith('Upgrader'))
			{
				creep.memory.role = 'upgrader';
				console.log(creep.name + ' switches to ' + creep.memory.role);
			} else if (creep.name.startsWith('Builder'))
			{
				creep.memory.role = 'builder';
				console.log(creep.name + ' switches to ' + creep.memory.role);
			}
			
			// free up the flag reservation using the appropriate function
			UnReserveMyFlag();
			// if still a harvester, return the energy to the structure or turn yourself into an upgrader
			if(creep.memory.role = 'harvester')
			{
				//find available structures to dump to
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) && 
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				});
				// if I found one, go transfer stuff
				if(targets.length > 0) {
					if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
					}
				} 
				// if I did not find a structure to transfer things, then become an upgrader temporarily
				else 
				{
					creep.memory.role = 'upgrader';
					console.log(creep.name + ' switches to ' + creep.memory.role);
				}
			}
		}
	
		// Function to reserve my flag
		function ReserveMyFlag()
		{
			//return mining location flags
			var flags = _.filter(Game.flags,(flag) => flag.name.startsWith('MiningLocation ') && flag.color == 10);
			// choose a random flag
			const random = Math.floor(Math.random() * flags.length);
			// color the flag red
			flags[random].setColor(COLOR_RED);  //flags[random].setColor(COLOR_RED)
			//write the flag's position to my memory
			creep.memory.reservations = flags[random].pos;
		}
		// Function to remove flag reservation
		function UnReserveMyFlag()
		{ 
			//return the reserved mining location flag that matches the reserved memory pos
			var flaggy = _.filter(Game.flags,(flag) => flag.name.startsWith('MiningLocation ') && flag.color == 1 && creep.pos.x == creep.memory.reservations.x && creep.pos.y == creep.memory.reservations.y);
			// reset the flag color to white
			
			for (var thing in flaggy)
			{
				flaggy[thing].setColor(COLOR_WHITE);
			}
			//clear the flag's position to my memory
			creep.memory.reservations = '';
		}
		// Function to move to my flag
		function MoveToFlag()
		{
			const destinationPos = new RoomPosition(creep.memory.reservations.x, creep.memory.reservations.y, creep.memory.reservations.roomName);
			creep.moveTo(destinationPos, {visualizePathStyle: {stroke: '#ffaa00'}});
			//console.log(creep.name + ' moving to ' + creep.memory._move.dest.room); //Troubleshooting creeps who get lost in other rooms when their destination should be elsewhere
		}
		function MineTheThing()
		{
			// find the closest sources
			const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
			// for each item in the array, check if it is in range
			// if can't reach any of them, unreserve this flag
			if(target) {
				if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
					//creep.moveTo(target);
					console.log('cant MineTheThing()');
				}
			}
		}
	}
};

module.exports = roleHarvester;