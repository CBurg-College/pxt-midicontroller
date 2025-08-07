## Gebruiken als extensie

Deze repository kan worden toegevoegd als **extensie** in MakeCode.
Echter is de code niet compleet omdat er een array ontbreekt.
Zonder de array levert dit de foutmelding: **Cannot find name 'songnotes'**.
Behalve de **pxt-midicontroller**-extensie moet je ook deze array
aan je programma toevoegen om de microbit in een midicontroller
om te vormen. Deze 'midicontroller' kan dan één audioclip afspelen.

## De array 'songnotes' toevoegen

De array 'songnotes' bevat de midi-instructies voor een audioclip en
wordt met het programma **MidiBuilder** gebouwd. Door in **MidiBuilder**
op **SCRIPT** te klikken, verschijnt een venster met de declaratie
van de array 'songnotes'. Kopieer de inhoud en plak deze in het
javascript-venster van je MakeCode-programma. Alle andere code kun
je verwijderen. Klik in Makecode op **Downloaden** en steek de microbit
in de edge-connector van de midi-interface. Nu is je microbit een
eenvoudige midi-controller. Het afspelen start met de 'A'-knop en stopt
met de 'B'-knop.

## De audioclip afspelen

Behalve met de 'A'-knop van de midi-controller-microbit, kan er met een
andere microbit ook op afstand worden afgespeeld. De MakeCode-extensie
**pxt-midi** biedt hier de ondersteuning voor. Je kunt er bovendien het
volume mee instellen, het tempo aanpassen, instrumenten kiezen en de
audioclip transponeren. Dit is tijdens het afspelen mogelijk. Door de
**pxt-midi**-extensie met andere extensies te combineren kun je
bovendien de muziek op beweging laten reageren of robot-bewegingen
met de muziek synchroniseren.

## Interactie met de audioclip

In het eerder genoemde programma **MidiBuilder** kun je aan de
midi-instructies **berichten** toevoegen die de extensie
**pxt-midicontroller** in de midi-controller-microbit naar de extensie
**pxt-midi** van de andere microbit stuurt. Met behulp van de
**pxt-midi**-extensie kun je vervolgens het programma van die andere
microbit op de muziek laten reageren. Omgekeerd bevat **pxt-midi**
codeblokken om de muziek op je programma te laten reageren.
