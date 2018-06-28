#include<iostream>  
using namespace std;  
  
void printbinary(const unsigned int val)  
{  
	cout << val << "\n";
    for(int i = 14; i >= 0; i--)  
    {  
        if(val & (1 << i))  
            cout << "1";  
        else  
            cout << "0";  
    }  
}  
  
int main()  
{  
    printbinary(17);  
    return 0;  
} 

// source: https://blog.csdn.net/xiaofei2010/article/details/7434737
