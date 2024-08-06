#ifndef CONS_H
#define CONS_H

#include <value.h>
#include <stdbool.h>
#include <module.h>

Value make_some(Module* mod, Value v);
Value make_none(Module* mod);
Value MAKE_CHAR(Module* mod, char c);

bool is_some(Value v);
Value get_some(Value v);

Value make_unit(Module* mod);

Value make_ok(Module* mod, Value v);
Value make_err(Module* mod, Value v);

void print_helper(Value v);

#endif  // CONS_H