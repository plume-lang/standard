#include "cons.h"

#include <stdlib.h>
#include <value.h>
#include <module.h>

Value make_some(Module* mod, Value v) {
  return MAKE_LIST(mod->stack, (Value[4]) {
    MAKE_SPECIAL(),
    MAKE_STRING(mod->stack, "Option"),
    MAKE_STRING(mod->stack, "Some"),
    v
  }, 4);
}

bool is_some(Value v) {
  HeapValue* p = GET_PTR(v);
  Value* l = p->as_ptr;
  return l[0] == kNull && strcmp(GET_STRING(l[1]), "Option") == 0 &&
         strcmp(GET_STRING(l[2]), "Some") == 0;
}

Value get_some(Value v) {
  HeapValue* p = GET_PTR(v);
  Value* l = p->as_ptr;

  return l[3];
}

Value make_unit(Module* mod) {
  return MAKE_LIST(mod->stack, (Value[3]) {
    MAKE_SPECIAL(),
    MAKE_STRING(mod->stack, "unit"),
    MAKE_STRING(mod->stack, "unit")
  }, 3);
}

Value make_none(Module* mod) {
  return MAKE_LIST(mod->stack, (Value[3]) {
    MAKE_SPECIAL(),
    MAKE_STRING(mod->stack, "Option"),
    MAKE_STRING(mod->stack, "None")
  }, 3);
}

Value MAKE_CHAR(Module* mod, char c) {
  char str[2];
  str[0] = c;
  str[1] = '\0';

  return MAKE_STRING(mod->stack, str);
}

Value make_ok(Module* mod, Value v) {
  return MAKE_LIST(mod->stack, (Value[4]) {
    MAKE_SPECIAL(),
    MAKE_STRING(mod->stack, "Result"),
    MAKE_STRING(mod->stack, "Ok"),
    v
  }, 4);
}

Value make_err(Module* mod, Value v) {
  return MAKE_LIST(mod->stack, (Value[4]) {
    MAKE_SPECIAL(),
    MAKE_STRING(mod->stack, "Result"),
    MAKE_STRING(mod->stack, "Error"),
    v
  }, 4);
}

void print_helper(Value v) {
  switch (get_type(v)) {
    case TYPE_MUTABLE: {
        printf("mut ");
        print_helper(GET_MUTABLE(v));
        break;
    }
    case TYPE_INTEGER:
      printf("%d", (int32_t) v);
      break;
    case TYPE_FLOAT:
      printf("%f", GET_FLOAT(v));
      break;
    case TYPE_STRING:
      printf("\"%s\"", GET_STRING(v));
      break;
    case TYPE_LIST: {
      HeapValue* p = GET_PTR(v);
      printf("[");
      for (int i = 0; i < p->length; i++) {
        print_helper(p->as_ptr[i]);
        if (i < p->length - 1) printf(", ");
      }
      printf("]");
      break;
    }
    case TYPE_SPECIAL:
      printf("<special>");
      break;
    
    case TYPE_UNKNOWN: {
      printf("<unknown>");
      break;
    }

    case TYPE_FUNCTION: case TYPE_FUNCENV: {
      printf("<function>");
      break;
    }

    case TYPE_API: {
      printf("<api>");
      break;
    }

    case TYPE_THREAD: {
      printf("<thread>");
      break;
    }
  }
}
