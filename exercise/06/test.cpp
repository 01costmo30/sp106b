#include <iostream>
#include <cstdlib>
#include <cctype>
#include <string>
#include <fstream>
#include <sstream>
#include <locale>

using namespace std;

string tobinary(const unsigned int val) { // reference file: sample_10_2.cpp
	string bin = "";
	for (int i = 14; i >= 0; i--)  {
		if (val & (1 << i)) {
			bin += "1";
		}else {
			bin += "0";
		}
	}
	return bin;
}

int main() {
	fstream readfile;
	string filename;
	// data that need.
	string symlist[10][2] = {
		{"SP", "0"},
		{"LCL", "1"},
		{"ARG", "2"},
		{"THIS", "3"},
		{"THAT", "4"},
		{"KBD", "24576"},
		{"SCREEN", "16384"}
	};
	
	//open file.
	cout << "input filename:";
	cin >> filename;
	readfile.open(filename.c_str(), ios::in);
	if (readfile.fail()) { // throw error.
		cout << "can not read file.";
		system("pause");
		exit(1);
	}
	
	// store and print code.
	int judge, line = 0;
	string data, code[1000]; 
	cout << "what's in the file:\n";
	while (!readfile.eof()) {
		getline(readfile, data);
		judge = data.rfind("//", data.length());
		if ((data.rfind("//", data.length()) == -1 || data.rfind("//", data.length()) != 0) && data != "" && data != " ") {
			int k = data.rfind("//", data.length());
			if (k != 0 && k != -1 ) {
				int l = data.length()-k;
				code[line] = data.replace(k, l, "");
			} else {
				code[line] = data;
			}
			if (!readfile.eof()) {
				cout << line << " " << code[line-1] << "end";
				cout << "\n";
			}
			line++;
		}
	}
	readfile.clear();
	readfile.close();
	
	// turn assembler code into binary code.
	string bcode;
	for (int i=0; i<line; i++) {
		if (code[i].find("@", 0) == 0) { // A instruction
			string a = code[i].substr(1);
			locale loc;
			if (isdigit(a, loc)) {
				int c;
				stringstream(a) >> c;
				cout << tobinary(c);
			}else {
				for (int j=0; j<7; j++) {
					string b = symlist[i][0];
					if (a.compare(b) == 0) {
						cout << tobinary(atoi(symlist[i][1].c_str()));
					}
				}
			}
		}
	}
	if (readfile.fail()) { //throw error.
		cout << "can not close file.";
		system("pause");
		exit(1);
	}
	system("pause");
	return 0;
}
