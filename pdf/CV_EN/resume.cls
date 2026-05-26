\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[2015/05/25 An elegant Résumé class]
\LoadClass[11pt]{article}

\setlength{\parindent}{0pt}

\RequirePackage{xltxtra}
\RequirePackage{xifthen}
\RequirePackage{fontawesome}
\RequirePackage[dvipsnames]{xcolor}
\RequirePackage{fontspec}
\RequirePackage{array}
\RequirePackage{titlesec}
\RequirePackage{enumitem}
\RequirePackage[super]{nth}

\setmainfont[
  Path = fonts/Main/ ,
  Extension = .otf ,
  UprightFont = *-regular ,
  BoldFont = *-bold ,
  ItalicFont = *-italic ,
  BoldItalicFont = *-bolditalic ,
  SmallCapsFont = Fontin-SmallCaps
]{texgyretermes}

\definecolor{AccentColor}{HTML}{1F4E79}
\definecolor{RuleColor}{HTML}{D6DDE6}
\definecolor{MutedColor}{HTML}{5E6B78}

\RequirePackage[
  a4paper,
  left=0.76in,
  right=0.76in,
  top=0.44in,
  bottom=0.52in,
  nohead
]{geometry}

\setlist{noitemsep}
\setlist[itemize]{topsep=0.22em, parsep=0pt, partopsep=0pt, itemsep=0.18em, leftmargin=1.35pc}
\setlist[enumerate]{topsep=0.22em, parsep=0pt, partopsep=0pt, itemsep=0.18em, leftmargin=1.35pc}

\titleformat{\section}
  {\Large\bfseries\raggedright\color{AccentColor}}
  {}{0em}
  {}
  [{\color{RuleColor}\titlerule[0.6pt]}]
\titlespacing*{\section}{0pt}{0.75em}{0.45em}

\titleformat{\subsection}
  {\normalsize\bfseries\raggedright}
  {}{0em}
  {}
\titlespacing*{\subsection}{0pt}{0.65em}{0.25em}

\newlength{\datecolumnwidth}
\setlength{\datecolumnwidth}{8.2em}

\newcommand{\entryrow}[2]{%
  \ifthenelse{\isempty{#2}}%
    {\par\noindent #1\par}%
    {\par\noindent
      \begin{tabular*}{\textwidth}{@{}>{\raggedright\arraybackslash}p{\dimexpr\textwidth-\datecolumnwidth-1em\relax}@{\hspace{1em}}>{\raggedleft\arraybackslash}p{\datecolumnwidth}@{}}
        \vspace{0pt}\strut #1 & \vspace{0pt}\strut {\small\color{MutedColor} #2}
      \end{tabular*}\par}%
}

\newcommand{\datedsection}[2]{%
  \section{#1}%
}
\newcommand{\datedsubsection}[2]{%
  \entryrow{\textbf{#1}}{#2}%
  \vspace{0.15em}%
}
\newcommand{\datedline}[2]{%
  \entryrow{#1}{#2}%
}
\newcommand{\entrydetail}[1]{%
  {\small #1\par}%
}

\newcommand{\name}[1]{
  {\par\centering\fontsize{16}{20}\selectfont #1\par}
  \vspace{0.2ex}
}
\newcommand{\contactInfo}[5]{
  {\par\centering\small\color{AccentColor}
    \faEnvelope\ \href{mailto:#2}{#2}%
    \textperiodcentered\
    \faPhone\ #1%
    \ifthenelse{\isempty{#3}}{}{ \textperiodcentered\ \faGlobe\ \href{#3}{Homepage}}%
    \ifthenelse{\isempty{#4}}{}{ \textperiodcentered\ \faGithub\ \href{#4}{GitHub}}%
    \ifthenelse{\isempty{#5}}{}{ \textperiodcentered\ #5}\par}
  \vspace{0.15ex}
}
\newcommand{\otherInfo}[4]{
  {\par\centering\small
    {#1}%
    \ifthenelse{\isempty{#2}}{}{ \textperiodcentered\ {#2}}%
    \ifthenelse{\isempty{#3}}{}{ \textperiodcentered\ {#3}}%
    \ifthenelse{\isempty{#4}}{}{ \textperiodcentered\ {#4}}\par}
  \vspace{0.4ex}
}

\newcommand{\yourphoto}[1]{
  \hfill \smash{\includegraphics[width={#1}\paperwidth]{images/mye.jpg}}
}

\newcommand{\role}[2]{
  {\par\textit{#1} ~ #2\par}
  \vspace{0.35ex}
}
