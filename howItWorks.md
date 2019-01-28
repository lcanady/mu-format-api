## Formatting Rules
#### The rules to formatting are pretty simple!
There are three ways to format code through this website.  You can enter the address of a formatted You can enter text into the enter field and hit format, you can load a pretty formated file from your local drive (#includes and #file won't work in this through this method) or you can load an archive from Github by putting the full address to the archive of code.

The rules for formatting .mu documents is pretty simple! First, You can format your code however you'd like.  I suggest adopting an easy to read style using indentations and spacing to make your code digestable. Because MUSHCode is an unblocked language, **MU-Format** Searches for ```&``` or ```@``` prefixes to mark the beginning of an attribute or command. You can add comments in your code in either ```/* ... */``` block style or ```// inline comments```.

```
/*
--------------------------------------------------------------------------------
--- Exit Format ----------------------------------------------------------------

Formats the room's exit list.

Basic exit format. Don't worry about color, it's applied automatically:
    Exit Name ;exit;en

Exits can have two optional attributes:
    &secondary  = 1
    &tertiary  = 1

*/

@ExitFormat [v( d.grp )]=
    [u( .header, Exits )]%r
    [columns(
        iter( %0,
            switch( 1,

// Find exits with the &secondary attribute

                issecondary( ## ),
                    edit(
                        name( ## ),
                        <, ansi( v( config.secondary ), < ),
                        >, ansi( v( config.secondary ), > )
                    ),

// Find exits with the &tertiary attribute

                istertiary( ## ),
                    edit(
                        name( ## ),
                        <, ansi( v( config.tertiary ), < ),
                        >, ansi( v( config.tertiary ), > )
                    ),
                edit(
                    name( ## ),
                    <, ansi( v( config.hcolor ), < ),
                    >, ansi( v( config.hcolor ), > )
                )
            ),,|
        )
        ,26,|
    )]
    [if(

// IC Area?

        not( hasflag( %!, IC )),
        footer( OOC AREA ),
        footer()
    )]

```

When we format this block of code, it turns into:

```
@ExitFormat [v( d.grp )]= [u( .header, Exits )]%r[columns( iter( %0, switch( 1, issecondary( ## ), edit( name( ## ), <, ansi( v( config.secondary ), < ), >, ansi( v( config.secondary ), > ) ), istertiary( ## ), edit( name( ## ), <, ansi( v( config.tertiary ), < ), >, ansi( v( config.tertiary ), > ) ), edit( name( ## ), <, ansi( v( config.hcolor ), < ), >, ansi( v( config.hcolor ), > ) ) ),,| ) ,26,| )][if( not( hasflag( %!, IC )), footer( OOC AREA ), footer() )]

```

**Simple!**

The real power of Mu-Format comes in it's #tag system.  #tags are, when the code is interpreted, translated into MU friendly commands.  They're honestly a good way to save a few keystrokes and even organize your code projects.  Lets take a look at the few that exist right now:

### #include /path/to/file.mu
This is probably the most powerful #tag in the Mu-Format arsonal right now.  It allows you to import a file (or entire Github repository for instance) into the current file.  #include accepts three kinds of files right now:
- **Local File** You can designate a local file to include by entering the ```./path/to/file.mu``` format.
- **Local Directory** If you list a directory, Mu-Format will look for a file called ```installer.mu``` and kick off the #include from there.
- **Github Archive** This is the same as installing from a local directory, instead you'll you'll enter ```github:user/repo```.

```
&cmd_command #123 = $foo *:
  think me Foo %0.
-

// Include the rest of the library.
#include ./path/to/file2.mu
-
```
### #file /path/to/file.txt
Honestly #file works list like #include, except it escapes each line of the text file with ```@@``` null commands so they don't get quoted to the mux.  This is great for things like license files, and custom header and footer elements that are repeated across various Mu project files.

```
@@ Legal Stuff
@@ Bla bla, yadda
@@ I don't really speak legal.
```

### #Header <title>=<body>
Information to be listed at the top of the resulting installer file. The library allows you to determine what special **#tags** are considered headers, like **#author #url #codebase**, etc.  I'm sure we'll have some defaults soon.  For now you can add a custom header to the beginning of the #header tag.

You can actually user ```Formatter.setHeaders('author, email, url')``` to add headers that can be set using a shortcut.  **#author**, **#email**, **#url** for example and would be set with ```#<header> <text>```