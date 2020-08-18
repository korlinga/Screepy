var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
		
		//if creep has free capacity
	    if(creep.store.getFreeCapacity() > 0) {
			//if creep does not have a Mining flag reserved in memory
			if (!creep.memory.reservations || !creep.memory.reservations.x || !creep.memory.reservations.y)
			{
				//run the flag reservation function
				ReserveMyFlag();
			}
			// if the creep does have a reservation BUT is a builder
			else if (creep.name.startsWith('Builder'))
			{
				//create a list of all the mining flags
				var flags = _.filter(Game.flags,(flag) => flag.name.startsWith('MiningLocation '));
				//assume the flag and the reservation do not match with this bool
				var flagGood = false;
				//for each mining flag
				for(var i in flags)
				{
					//if the flag x AND y position match the reservation then flagGood is true
					if(flags[i].pos.x == creep.memory.reservations.x && flags[i].pos.y == creep.memory.reservations.y)
					{
						var flagGood = true;
					}
				}
				console.log(flagGood);
				// if there were any matches, the flagGood will be true and this if statement will not run
				if (flagGood = false)
				{
					console.log('Resetting the reservation for ' + creep.name);
					ReserveMyFlag();
				}
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
			
			//if there is a reservation, then unreserve it
			if(creep.memory.reservations != '')
			{
				// free up the flag reservation using the appropriate function
				UnReserveMyFlag();
				console.log(creep.name + ' removes a flag RSVP');
			}

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
			if(flags.length > 0){
				// choose a random flag
				const random = Math.floor(Math.random() * flags.length);
				// color the flag red
				flags[random].setColor(COLOR_RED);  //flags[random].setColor(COLOR_RED)
				//write the flag's position to my memory
				creep.memory.reservations = flags[random].pos;
			}
			else {
				//find the spawn in the room
				const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
				console.log(creep.name + ' cannot make a reservation and is moving to ' + spawn.name);
				creep.moveTo(spawn.pos);
			}
		}
		// Function to remove flag reservation
		function UnReserveMyFlag()
		{
			//identify an array flaggy[] with all the flags starting with 'MiningLocation ' and RED color
			var flaggy = _.filter(Game.flags,(flag) => flag.name.startsWith('MiningLocation ') && flag.color == 1);
			//for each flag in the flaggy[] array, 
			for (var flag in flaggy)
			{
				//if the flag position matches the creep position
				if(flaggy[flag].pos.x == creep.pos.x && flaggy[flag].pos.y == creep.pos.y)
				{
					//reset the flag color to white
					flaggy[flag].setColor(COLOR_WHITE);
					//DEBUG console report
					console.log(creep.name + ' reset a flag to white at ' + flaggy[flag].pos.x + ',' + flaggy[flag].pos.y + ' in room ' + creep.room.name);
					//clear the flag's position to my memory
					creep.memory.reservations = '';
				}
				//if the flag position does not match the creep position, but the UnReserveMyFlag() function was still called for some reason
				else
				{
					console.log(creep.name + ' could not find a reserved flag at his position and is wiping reservations in ' + creep.room.name);
					creep.memory.reservations = '';
				}
			}
		}
		// Function to move to my flag
		function MoveToFlag()
		{
			if(creep.memory.reservations)
			{
				const destinationPos = new RoomPosition(creep.memory.reservations.x, creep.memory.reservations.y, creep.memory.reservations.roomName);
				creep.moveTo(destinationPos, {visualizePathStyle: {stroke: '#ffaa00'}});
				//console.log(creep.name + ' moving to ' + creep.memory._move.dest.room); //Troubleshooting creeps who get lost in other rooms when their destination should be elsewhere
			}
			else
			{
				ReserveMyFlag();
			}
		}
		function MineTheThing()
		{
			// find the closest sources
			const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
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