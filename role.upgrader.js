var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.name.startsWith('Harvester') && creep.store[RESOURCE_ENERGY] == 0){
            creep.memory.role = 'harvester';
        }
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
			creep.memory.role = 'harvester';
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
			ReserveControllerLocation();
	    }
		
	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				const myControllerDest = new RoomPosition(creep.memory.mycontrollerpos.x, creep.memory.mycontrollerpos.y, creep.memory.mycontrollerpos.roomName);
				creep.moveTo(myControllerDest, {visualizePathStyle: {stroke: '#ffffff'}});
				//console.log(creep.name + ' is running upgrades to ' + myControllerDest);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
		function ReserveControllerLocation()
		{
			const myControllerPos = new RoomPosition(creep.room.controller.pos.x, creep.room.controller.pos.y, creep.room.controller.pos.roomName);
			creep.memory.mycontrollerpos = myControllerPos;
		}
	}
};

module.exports = roleUpgrader;