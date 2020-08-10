var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
		//if creep has free capacity
	    if(creep.store.getFreeCapacity() > 0) {
			//check if flag reservation NOT set
			if (!creep.memory.reservations)
			{
					ReserveMyFlag();
			}
			//check if at the reserved flag
			// if at the reserved flag
			if(creep.pos.x == creep.memory.reservations.x && creep.pos.y == creep.memory.reservations.y) 
			{
				MineTheThing();
			}
			else {
				MoveToFlag();
			}
		}
		else // if the creep is full
		{
			UnReserveMyFlag();
			//find available structures
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
			} // if I did not find a structure to transfer things, then become an upgrader temporarily
			else 
			{
				creep.memory.role = 'upgrader';
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
			flags[random].setColor(COLOR_RED);
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
			creep.moveTo(creep.memory.reservations.x,creep.memory.reservations.y, {visualizePathStyle: {stroke: '#ffaa00'}, range:0});
		}
		function MineTheThing()
		{
			// find the closest sources
			const target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
			// for each item in the array, check if it is in range
			// if can't reach any of them, unreserve this flag
			if(target) {
				if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}
		}
	}
};

module.exports = roleHarvester;