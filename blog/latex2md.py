import re


def regex_replace(pattern, replace):
    def f(in_str):
        return re.sub(pattern, replace, str(in_str), flags=re.DOTALL)

    return f"Replace {pattern} with {replace}", f


def regex_replace_within(pattern_group, pattern_within, replace):
    def f(in_str):
        return re.sub(pattern_group, lambda m: re.sub(pattern_within, replace, m[0]), str(in_str), flags=re.DOTALL)

    return f"Replace {pattern_within} with {replace} within {pattern_group}", f


fs = [
    regex_replace(r"\\prob\{([^}]+)}", r'\\boldsymbol{\\mathbf{\1}}'),
    regex_replace(r"\\given", r'\\: \\vert \\:'),
    regex_replace(r"\\distas", r'\\sim'),
    regex_replace(r"\\textbf\{([^}]+)}", r"**\1**"),
    regex_replace(r"\\label\{([^}]+)}", r""),
    regex_replace(r"\\mathbbm\{([^}]+)}", r"\\mathbf{\1}"),
    regex_replace(r"\\section\{([^}]+)}", r"# \1"),
    regex_replace(r"\\subsection\{([^}]+)}", r"## \1"),
    regex_replace(r"\\subsubsection\{([^}]+)}", r"### \1"),
    regex_replace_within(r"\\begin\{align}(.+?)\\end\{align}", r"&", ""),
    regex_replace(r"\\begin\{align}(.+?)\\end\{align}", r"$$\1$$"),
]

import sys

s = "".join(sys.stdin.readlines())

for desc, f in fs:
    print(desc, file=sys.stderr)
    s = f(s)

print(s)
