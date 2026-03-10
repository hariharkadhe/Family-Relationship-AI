% Facts
male(harihar).
male(mehul).
male(vivek).
male(amit).
male(rohan).
female(savita).
female(priya).
female(anjali).
female(meena).
female(kavita).

% Parent relationships (Parent, Child)
% Harihar and Savita's children
parent(harihar, vivek).
parent(harihar, amit).
parent(harihar, priya).
parent(savita, vivek).
parent(savita, amit).
parent(savita, priya).

% Vivek and Meena's children
parent(vivek, mehul).
parent(vivek, anjali).
parent(meena, mehul).
parent(meena, anjali).

% Amit and Kavita's child
parent(amit, rohan).
parent(kavita, rohan).

% Rules
father(X, Y) :- male(X), parent(X, Y).
mother(X, Y) :- female(X), parent(X, Y).

sibling(X, Y) :- parent(Z, X), parent(Z, Y), X \= Y.

grandparent(X, Y) :- parent(X, Z), parent(Z, Y).
grandfather(X, Y) :- male(X), grandparent(X, Y).
grandmother(X, Y) :- female(X), grandparent(X, Y).

uncle(X, Y) :- male(X), sibling(X, Z), parent(Z, Y).
aunt(X, Y) :- female(X), sibling(X, Z), parent(Z, Y).

% Helper for the web system to print results with variable names
run_ai_query(Query, Bindings) :-
    (   call(Query)
    ->  (   Bindings = []
        ->  write('true.')
        ;   write_bindings(Bindings)
        ), nl
    ;   write('false.'), nl
    ).

write_bindings([]).
write_bindings([Name=Value|T]) :-
    write(Name), write(' = '), write(Value),
    (T = [] -> true ; write(', '), write_bindings(T)).
male(kiran).
parent(vivek, kiran).
parent(vivek, kiran).
