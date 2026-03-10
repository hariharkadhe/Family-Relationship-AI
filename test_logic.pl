:- consult('family.pl').

test :-
    QueryAtom = 'father(X, mary)',
    read_term_from_atom(QueryAtom, Query, [variable_names(Bindings)]),
    write('Query: '), write(Query), nl,
    write('Bindings before: '), write(Bindings), nl,
    call(Query),
    write('Bindings after: '), write(Bindings), nl,
    halt.

:- test.
