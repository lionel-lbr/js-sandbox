// ab2[cd]ef
// abcdcdef


// 1[m2[n3[o]x]]
// mnoooxnooox

// 2[2[o]]

// [2, n, [3, o ], x]

const testValues = [
  ["ab2[cd]ef", "abcdcdef"],
  ["1[mnh2[n3[o]x]]", "mnhnoooxnooox"],
  ["2[2[o]]", "oooo"],
  ["ab2[cd]ef3[hjk]er", "abcdcdefhjkhjkhjker"],
  ["1[mnh2[n3[oe2[ab]cd3[uyu]]x]]", "mnhnoeababcduyuuyuuyuoeababcduyuuyuuyuoeababcduyuuyuuyuxnoeababcduyuuyuuyuoeababcduyuuyuuyuoeababcduyuuyuuyux"],
]

function decodeString(s) {
  var finalString = "";

  const isDigit = (c) => (Number(c) == +c ? true : false);
  const findLastBracketIndex = (str, index) => {
    var brackets = 0
    var i = index;
    while (i < str.length) {
      if (str[i] == ']') {
        brackets--;
        if (brackets == 0)
          return i;
      }

      if (str[i] == '[') {
        brackets++;
      }

      i++;
    }
    return -1;
  }

  // assume s is a perfect [] substring
  const decodeSubString = (n, s) => {
    var subString = "";
    s = s.slice(1, -1);  // remove enclosing [ ] 
    var i = 0;
    while (i < s.length) {
      if (isDigit(s[i])) {
        const startIndex = i + 1
        const endIndex = findLastBracketIndex(s, startIndex);
        if (endIndex == -1) {
          throw new Error("String wrongly formated");
        }

        subString += decodeSubString(+s[i], s.slice(startIndex, endIndex + 1));
        i = endIndex + 1;
      }
      else {
        subString += s[i];
        i++;
      }
    }

    return subString.repeat(n);
  };

  if (isDigit(s[0])) {
    finalString = decodeSubString(+s[0], s.slice(1, s.length))
  }
  else {
    finalString = decodeSubString(1, `[${s}]`)
  }

  return finalString;
}

for (v of testValues) {
  const r = decodeString(v[0])
  if (r == v[1]) {
    console.log(`Success: ${v[0]} => ${r}`)
  } else {
    console.log(`Error: ${v[0]} => ${r}, should be ${v[1]}`)
  }
}

