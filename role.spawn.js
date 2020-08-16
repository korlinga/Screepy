var roleSpawn = {
    run: function(spawn) {

		// TYPE 1 FOR REPORT //
		var report = 0;
		
		//Identify the Controller Level of the spawn's room
		var controllerLevel = Game.spawns[spawn].room.controller.level;
		
		//Identify the memory location in the Spawn object
		var greyWare = Game.spawns[spawn].memory.controllerlevel;
		
		// if the spawn memory slot does not yet exist
		//OR
		// the controller leveled up and does not currently match the memory slot
		if(!greyWare || greyWare != controllerLevel)
		{
			//congrats on lvl up
			console.log('Congratulations!  Level Up, Baby!');
			//update memory with current controller level
			greyWare = controllerLevel;
			//Activate Construction
			ConstructionSites(greyWare);
		}
		//reporting//
		if (report == 1)
		{
			console.log(
				spawn + 
				'\nController Level ' + controllerLevel
				);
		}
		
		//function for running construction jobs based on controller level
		function ConstructionSites(lvl)
		{
			if (lvl == 0)
			{
				BuildThings('Roads');
				//BuildThings('Containers');
			}
			if (lvl == 1)
			{
				console.log('Activate BuildThings(Spawn)');	
			}
			if (lvl == 2)
			{
				console.log('Activate 5 BuildThings(Extensions)');
				console.log('Activate the BuildThings(Ramparts-300k)');
				console.log('Activate the BuildThings(Walls)');
			}
			if (lvl == 3)
			{
				console.log('Activate 5 BuildThings(Extensions)');
				console.log('Activate the BuildThings(Ramparts-1M)');
				console.log('Active the BuildThings(Tower)');
			}
		}
		
		//Build things en masse based off the building type
		function BuildThings(thing)
		{
			var startAtPos = Game.spawns[spawn];
			var allMyFlags = _.filter(Game.flags,(flag) => flag.name.startsWith('MiningLocation '));
			var controllerPos = Game.spawns[spawn].room.controller.pos;
			var miningPath = Game.spawns[spawn].memory.miningpath;
			var controllerPath = Game.spawns[spawn].memory.controllerpath;
			
			// if BuildThings('Roads')
			if (thing == 'Roads')
			{
				// if the spawn does not already remember a path to the mining sources OR the controller path
				if (!miningPath || !controllerPath) 
				{
					// grab each MiningFlag
					for (var flag in allMyFlags)
					{
						// create a path from the spawn to each flag
						const path = startAtPos.pos.findPathTo((allMyFlags[flag].pos.x),(allMyFlags[flag].pos.y));
						//write the path to the spawn's memory
						Game.spawns[spawn].memory.miningpath = Room.serializePath(path);
					}
					//create another path from spawn to the controller
					const path2 = startAtPos.pos.findPathTo((controllerPos.x),(controllerPos.y));
					//write the serialized path to the spawn's memory
					Game.spawns[spawn].memory.controllerpath = Room.serializePath(path2);
					//run the function to build roads with the now populated paths
					BuildRoads();
				}
				// if the spawn does have a stored path to mining & controller locations
				else
				{
					//run the function to build roads with the now populated paths 
					BuildRoads();
				}					
			}
			// if BuildThings('Containers') 
			else if (thing == 'Containers')
			{
				console.log('Build Container Here');
			}
		}
		function BuildRoads()
		{
			//get the serialized mining path
			var miningPathSerialized = Game.spawns[spawn].memory.miningpath;
			//get the serialized controller path
			var controllerPathSerialized = Game.spawns[spawn].memory.controllerpath;
			//get the serialized miningpath and deserialize it into an array
			const builderPath = Room.deserializePath(miningPathSerialized);
			// for each stone in the path, build a road construction object
			for(var stone in builderPath)
			{
				Game.spawns[spawn].room.createConstructionSite(builderPath[stone].x, builderPath[stone].y, STRUCTURE_ROAD);
			}
			//get the serialized controllerpath and deserialize it into an array
			const controllerPath = Room.deserializePath(controllerPathSerialized);
			// for each stone in the path, build a road construction object
			for(var stone in controllerPath)
			{
				Game.spawns[spawn].room.createConstructionSite(controllerPath[stone].x, controllerPath[stone].y, STRUCTURE_ROAD);
			}
		}
		function Maintenance()
		{
			// add maintenance scripts
		}
	}
};

module.exports = roleSpawn;