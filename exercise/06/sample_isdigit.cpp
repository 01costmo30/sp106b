// isdigit example (C++)
#include <iostream>       // std::cout
#include <string>         // std::string
#include <locale>         // std::locale, std::isdigit
#include <sstream>        // std::stringstream

int main ()
{
  std::locale loc;
  std::string str;
  std::cout << "input:"; 
  std::cin >> str;
  if (isdigit(str[0],loc))
  {
    int year;
    std::stringstream(str) >> year;
    std::cout << "The year that followed " << year << " was " << (year+1) << ".\n";
  }
  return 0;
}
