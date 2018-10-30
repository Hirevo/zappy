# Zappy: Protocole GUI-Serveur

## Introduction

Ceci est la spécification du protocol GUI-Serveur utilisé pour ce projet.  
Tous les messages émis seront formattés en JSON valide (excepté pour la phase d'authentification auprès du server).  
Lors des phases de description des requêtes-réponses:
```
--> [message]: Décrit un message client vers server (Requête).
<-- [message]: Décrit un message serveur vers client (Réponse).
```

## Authentification

Suite à la connection, les premiers échanges se passeront comme décrit ci-contre pour s'authentifier en tant que GUI:
```
<-- WELCOME
--> gui
<-- ok
```

Suite à ces commandes, le serveur est prêt à recevoir des requêtes JSON pour le GUI.

## Commandes

Les commandes reconnus par le serveur sont les suivantes.

### Taille de la map

Requête:
```json
{
    "command": "map-size"
}
```

Réponse:
```json
{
    "type": "response",
    "response-type": "map-size",
    "size": {
        "width": 10,
        "height": 20
    }
}
```

### Tickrate du serveur

Requête:
```json
{
    "command": "tickrate"
}
```

Réponse:
```json
{
    "type": "response",
    "response-type": "map-size",
    "tickrate": 10
}
```

### Liste d'entités

Requête:
```json
{
    "command": "entities"
}
```

Réponse:
```json
{
    "type": "response",
    "response-type": "entities",
    "data": [
        {
            "type": "food",
            "data": [
                {"amount": 3, "pos": {"x": 1, "y": 2}},
                {"amount": 2, "pos": {"x": 4, "y": 2}},
                {"amount": 3, "pos": {"x": 5, "y": 5}},
                {"amount": 4, "pos": {"x": 5, "y": 3}}
            ]
        },
        {
            "type": "sibur",
            "data": [
                {"amount": 1, "pos": {"x": 10, "y": 20}},
                {"amount": 1, "pos": {"x": 5, "y": 13}}
            ]
        },
        {
            "type": "player",
            "data": [
                {
                    "id": 1,
                    "team": "Eo",
                    "facing": "N",
                    "level": 8,
                    "pos": {
                        "x": 1,
                        "y": 2
                    }
                }
            ]
        }
    ]
}
```

### Contenu d'une case

Requête:
```json
{
    "command": "tile",
    "pos": {
        "x": 4,
        "y": 10
    }
}
```

Réponse:
```json
{
    "type": "response",
    "response-type": "tile",
    "pos": {
        "x": 4,
        "y": 10
    },
    "data": [
        {
            "type": "food",
            "amount": 4
        },
        {
            "type": "sibur",
            "amount": 10
        },
        {
            "type": "player",
            "ids": [ 4, 5, 6 ]
        }
    ]
}
```

### Infos de joueur

Requête:
```json
{
    "command": "player",
    "id": 2
}
```

Réponse:
```json
{
    "type": "response",
    "response-type": "player",
    "data": {
        "id": 2,
        "team": "Eo",
        "level": 5,
        "facing": "N",
        "pos": {
            "x": 4,
            "y": 3
        }
    }
}
```

## Événements

Des événements peuvent surgir à n'importe quel moment et le serveur enverra les informations liés à ces événements à tous les GUIs connectés.

### Joueur

Connexion de joueur:
```json
{
    "type": "event",
    "event-type": "player-join",
    "data": {
        "id": 2,
        "team": "Eo",
        "level": 5,
        "facing": "N",
        "pos": {
            "x": 4,
            "y": 3
        }
    }
}
```

Mouvement de joueur:
```json
{
    "type": "event",
    "event-type": "player-move",
    "data": {
        "id": 2,
        "pos": {
            "x": 10,
            "y": 11
        }
    }
}
```

Orientation de joueur:
```json
{
    "type": "event",
    "event-type": "player-turn",
    "data": {
        "id": 2,
        "facing": "N"
    }
}
```

Mort de joueur:
```json
{
    "type": "event",
    "event-type": "player-death",
    "data": {
        "id": 2,
        "reason": "starvation"
    }
}
```

Look du joueur:
```json
{
    "type": "event",
    "event-type": "player-look",
    "data": {
        "id": 2
    }
}
```

Inventaire du joueur:
```json
{
    "type": "event",
    "event-type": "player-inventory",
    "data": {
        "id": 2
    }
}
```

### Items

Dépôt d'item:
```json
{
    "type": "event",
    "event-type": "item-drop",
    "data": {
        "id": 2,
        "item": "sibur",
        "pos": {
            "x": 3,
            "y": 2
        }
    }
}
```

Ramassage d'item:
```json
{
    "type": "event",
    "event-type": "item-pickup",
    "data": {
        "id": 2,
        "item": "sibur",
        "pos": {
            "x": 3,
            "y": 2
        }
    }
}
```

### Incantation

Début d'incantation:
```json
{
    "type": "event",
    "event-type": "incantation-start",
    "data": {
        "id": 2,
        "current-level": 4
    }
}
```

Succés de l'incantation:
```json
{
    "type": "event",
    "event-type": "incantation-success",
    "data": {
        "id": 2,
        "current-level": 5
    }
}
```

Echec de l'incantation:
```json
{
    "type": "event",
    "event-type": "incantation-fail",
    "data": {
        "id": 2,
        "current-level": 4
    }
}
```

### Oeuf

Debut du dépôt d'oeuf
```json
{
    "type": "event",
    "event-type": "egg-drop-start",
    "data": {
        "player-id": 2
    }
}
```

Fin du dépôt d'oeuf
```json
{
    "type": "event",
    "event-type": "egg-drop-end",
    "data": {
        "player-id": 2,
        "egg-id": 3,
        "team": "Eo",
        "pos": {
            "x": 3,
            "y": 2
        }
    }
}
```

Eclosion d'oeuf
```json
{
    "type": "event",
    "event-type": "egg-hatch",
    "data": {
        "egg-id": 3,
        "team": "Eo",
        "pos": {
            "x": 3,
            "y": 2
        }
    }
}
```

### Tickrate

```json
{
    "type": "event",
    "event-type": "tickrate-switchhover",
    "data": {
        "tickrate": 10
    }
}
```

### Broadcasts

```json
{
    "type": "event",
    "event-type": "broadcast",
    "data": {
        "id": 2,
        "message": "Please help me !"
    }
}
```

## Erreurs

Lors d'une erreur, une réponse spéciale sera renvoyé au client par le serveur.

### Erreur de syntaxe

```json
{
    "type": "error",
    "error-type": "syntax-error"
}
```

### Erreur de commande

```json
{
    "type": "error",
    "error-type": "command-error"
}
```
