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
		if(!greyWare || greyWare != controllerLevel) //		if(!greyWare || greyWare != controllerLevel)
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
			if (lvl >= 0)
			{
				BuildThings('Roads');
				BuildThings('Containers');
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
			// the room spawn object
			var startAtPos = Game.spawns[spawn];
			// the mining flag objects in an array
			var allMyFlags = _.filter(Game.flags,(flag) => flag.name.startsWith('MiningLocation '));
			// the controller pos
			var controllerPos = Game.spawns[spawn].room.controller.pos;
			// the location in the spawns memory storing the serialized path from the spawn to each mining flag
			var miningPath = Game.spawns[spawn].memory.miningpath;
			// the location in the spawns memory storing the serialized path from the spawn to the controller
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
				console.log('Building ' + thing);
				//var get the number of containers in the room
				const containerCount = Game.spawns[spawn].room.find(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER);
					}
				});
				//get the number of construction sites for containers in the room
				const containerConstSiteCount = Game.spawns[spawn].room.find(FIND_MY_CONSTRUCTION_SITES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_CONTAINER);
					}
				});
				// if there are less than five
				if((containerCount.length + containerConstSiteCount) < 5)
				{
					// identify mining flags
					var flags = _.filter(Game.flags,(flag) => flag.name.startsWith('MiningLocation '));
					console.log(flags.length + ' Mining flags found in the room'); //DEBUG
					// identify mineral resource (one in each room so no for loop required)
					var mineralSource = Game.spawns[spawn].room.find(FIND_MINERALS); 
					console.log(mineralSource.length + ' minerals found in the room'); //DEBUG
					//get the room Terrain object
					const terrain = Game.map.getRoomTerrain(Game.spawns[spawn].room.name);
					console.log(terrain + ' TERRAIN WAS FOUND'); //DEBUG
					//build a list of locations next to the mineralSource
					var spotCheck = [];
					//build a list of valid locations next to the mineralSource
					var spot = [];
					//push each position around the mineralSource to the spotCheck array
					spotCheck.push([mineralSource[0].pos.x,mineralSource[0].pos.y+1]);
					spotCheck.push([mineralSource[0].pos.x,mineralSource[0].pos.y-1]);
					spotCheck.push([mineralSource[0].pos.x-1,mineralSource[0].pos.y]);
					spotCheck.push([mineralSource[0].pos.x-1,mineralSource[0].pos.y+1]);
					spotCheck.push([mineralSource[0].pos.x-1,mineralSource[0].pos.y-1]);
					spotCheck.push([mineralSource[0].pos.x+1,mineralSource[0].pos.y]);
					spotCheck.push([mineralSource[0].pos.x+1,mineralSource[0].pos.y+1]);
					spotCheck.push([mineralSource[0].pos.x+1,mineralSource[0].pos.y-1]);
					console.log(spotCheck.length + ' is how long spotCheck array is'); //DEBUG
					//for each item in the spotCheck[] array, fill in the pos and push to spot[] array
					for (var z in spotCheck){
						switch(terrain.get(spotCheck[z][0],spotCheck[z][1])) {
							case TERRAIN_MASK_WALL:
								break;
							case TERRAIN_MASK_SWAMP:
								break;
							case 0:
								spot.push(spotCheck[z]);
								break;
						}
					}
					console.log(spot.length + 'is the length of the spot[] array'); //DEBUG
					//create an empty array for final buildable locations
					var buildContainersHere = [];
					
					//push the first item from the spot[] array to the final buildable location
					buildContainersHere.push(spot[0]);
					console.log(buildContainersHere.length + ' is this long after one push from the spot array'); //DEBUG
					//for the next four final build locations added to the buildContainersHere[] array, loop 4 times and push
					//a random flag into the array, removing it from the flags[] array using splice()
					for(var i = 0; i<4; i++)
					{
						// choose a random number from the flag array length
						const random = Math.floor(Math.random() * flags.length);
						//add the flag from the random position above to the final buildable location array
						buildContainersHere.push([flags[random].pos.x,flags[random].pos.y]);
						//remove the random flag from the flags array
						flags.splice(random,1);
					}
					console.log(buildContainersHere.length + 'is this long after 4 more pushes from the flag array'); //DEBUG
					console.log(buildContainersHere); //DEBUG
					// for each item in buildContainersHere[] array, create a Container construction site at the plains terrain

					for (var point in buildContainersHere)
					{
						switch(Game.spawns[spawn].room.createConstructionSite(buildContainersHere[point][0],buildContainersHere[point][1],STRUCTURE_CONTAINER))
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
		function BuildContainers()
		{
			
		}
		function Maintenance()
		{
			// add maintenance scripts
		}
	}
};

module.exports = roleSpawn;