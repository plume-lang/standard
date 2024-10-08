const fs = require('fs/promises');
const readline = require('node:readline');
const childProcess = require('child_process');

function parseVersion(ver) {
  const [major, minor, patch] = ver.split('.').map(Number);

  return {
    major,
    minor,
    patch
  }
}
const {major} = parseVersion(process.version.slice(1));

if (major < 20) 
  throw new Error("Node.js version 20 or higher is required.");

async function doesFileExist(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  to_string: (e) => e.toString(),
  add_str: (a, b) => a + b,
  mul_str: (a, b) => a * b,
  string_length: (s) => s.length,
  eq_string: (a, b) => a === b,
  get_index_str: (s, i) => {
    if (i < 0 || i >= s.length) {
      return [null, "Option", "None"];
    }

    return [null, "Option", "Some", s[i]];
  },
  str_slice: (s, start, end) => s.slice(start, end),
  show_bool: (b) => b ? "true" : "false",

  async read_file(path) {
    if (await doesFileExist(path)) {
      return [null, "Option", "Some", await fs.readFile(path, 'utf-8')];
    }

    return [null, "Option", "None"];
  },
  async write_file(path, content) {
    if (await doesFileExist(path)) {
      try {
        await fs.writeFile(path, content);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  },
  async append_file(path, content) {
    if (await doesFileExist(path)) {
      try {
        await fs.appendFile(path, content);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  },
  does_file_exist: (path) => fs.access(path)
    .then(() => true)
    .catch(() => false),

  ffi_print: (s) => process.stdout.write(s),
  ffi_println: (s) => console.log(s),
  get_args: () => process.argv.slice(2),
  execute_command(cmd) {
    try {
      childProcess.execSync(cmd);
      return 1;
    } catch {
      return 0;
    }
  },
  input: (prompt) => new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  
  }),
  add_int: (a, b) => a + b,
  sub_int: (a, b) => a - b,
  mul_int: (a, b) => a * b,
  div_int: (a, b) => a / b,
  mod_int: (a, b) => a % b,

  float_to_int: (f) => parseInt(f),
  int_to_float: (i) => parseFloat(i),

  eq_int: (a, b) => a === b,
  lt_int: (a, b) => a < b,

  add_float: (a, b) => a + b,
  sub_float: (a, b) => a - b,
  mul_float: (a, b) => a * b,
  div_float: (a, b) => a / b,
  mod_float: (a, b) => a % b,
  pow_float: (a, b) => Math.pow(a, b),
  eq_float: (a, b) => a === b,
  lt_float: (a, b) => a < b,

  list_concat: (a, b) => a.concat(b),
  ffi_get_index(l, i) {
    if (i < 0 || i >= l.length) {
      return [null, "Option", "None"];
    }

    return [null, "Option", "Some", l[i]];
  },
  ffi_slice_list: (l, start, end) => l.slice(start, end),

  char_to_string: (c) => c,
  eq_char: (a, b) => a === b,

  'async': async (f) => await f,

  fetch: async(url) => {
    try {
      const res = await fetch(url);
      const txt = await res.text();

      return [null, "Result", "Ok", txt];
    } catch (e) {
      return [null, "Result", "Error", e.toString()];
    }
  },

  wait_all: (promises) => Promise.all(promises),
  add_big: (x, y) => x + y,
  sub_big: (x, y) => x - y,
  mul_big: (x, y) => x * y,
  div_big: (x, y) => x / y,
  mod_big: (x, y) => x % y,
  int_to_big: (x) => new BigInt(x),
  big_to_str: (x) => x.toString(),
  eq_big: (x, y) => x === y,
  lt_big: (x, y) => x < y,
  create_big: (x) => new BigInt(x),

  str_to_int: (x) => {
    const res = parseInt(x);
    if (isNaN(res)) {
      return [null, 'Option', 'None'];
    }

    return [null, 'Option', 'Some', res];
  },

  str_to_list: (s) => s.split(''),
  list_to_str: (l) => l.join(''),

  ceil: (x) => Math.ceil(x),
  floor: (x) => Math.floor(x),
  random: () => Math.random(),

  debug: (x) => {
    console.log(x);
    return x;
  },

  regex_match: (s, re) => {
    const regex = new RegExp(re);
    return regex.test(s);
  },

  regex_replace: (s, re, replace) => s.replace(re, replace),

  regex_exec: (s, re) => {
    const match = re.exec(s);
    if (match === null) {
      return [null, 'Option', 'None'];
    }

    return [null, 'Option', 'Some', match];
  },

  regex_exec_all: (s, re) => {
    const matches = [];
    let match;
    while ((match = re.exec(s)) !== null) {
      matches.push(match);
    }

    return matches;
  }
}
