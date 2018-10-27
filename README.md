# Unix System Development: Network Unit - Zappy

## Authors

- **`Nicolas POLOMACK`** (email: nicolas.polomack@epitech.eu)
- **`Cédric THOMAS`** (email: cedric.thomas@epitech.eu)
- **`Maxime JENNY`** (email: maxime.jenny@epitech.eu)
- **`Thibaut CORNOLTI`** (email: thibaut.cornolti@epitech.eu)
- **`Arthur KNOEPFLIN`** (email: arthur.knoepflin@epitech.eu)
- **`Bastien RINCK`** (email: bastien.rinck@epitech.eu)

## Introduction

This project is about playing a game.  
In this game, the goal is to reach level 8.  
To elevate to the next level, stones are required and sometimes multiple player must be present.  
Differents kinds and quantities of stone are required depending on the level to reach.  
Along with stones, food is required to live as they are consumed with time.  
Stones and food can be picked up from the ground or dropped to the ground.  

The project is composed of 3 modules:
- The server module [C]:
    - It implements the game and exposes it to clients.
    - It manages clients asynchronously.
    - It has 3 modes: Player mode, UI mode and Administrator mode.
- The AI module [Python]:
    - It can connect to the server and play the game.
    - It is able to get all the way to level 8.
- The UI module [Typescript]:
    - It can connect to the server and access custom commands to hook into the state of the game.
    - The server notifies it of every events occuring in the game.
    - It represents the game world as a 3D scene using Three.JS.

## Build instructions

Here are the instructions on how to build the different modules of the project on Linux and UNIX-like OSes.  

### Server

The server module is implemented in C.  
It can be found in the `server/` folder.  
It uses and vendors the [libjson-c](https://github.com/Hirevo/libjson-c) library to communicate with the GUI module.  
It also uses various other libraries to achieve cleaner, less error-prone code.  

No dependancy is required to build it except `gcc` and `make`.  

To start the build, do either:
```bash
# From the repository root folder
make -C server

# From the server/ folder
make
```

To restart the build, use `make re` instead of `make`

You can then launch it like this:
```bash
./zappy_server [-n [teams]...] [-f [ticks per second]] [-p [port]] [-h]
```

### GUI

The graphical interface is implemented in TypeScript and uses Three.JS.  
It can be found in the `gui/` folder.  

For building the GUI you will need Node (version 9 or above) and NPM.  
You can install Node and NPM via [NVM](http://nvm.sh) or follow the instructions over at [nodejs.org](https://nodejs.org/en/download/current/).  

To start the build, do either:
```bash
# From the repository root folder
cd gui

# Install the necessary module
npm install

# Install webpack
npm install -g webpack webpack-cli

# Compile TypeScript and pack the source
webpack

# Launch web server
node .
```

Note:  
The port for the web interface is 33333.

The default port to the server module is 33334 (on localhost).  
You can change it via the `--serv` flag.

Example:
```bash
node . --serv=10.14.59.200:8080
```
