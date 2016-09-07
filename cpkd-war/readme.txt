Please export the files on a Server or on a Local Development Web Server to preview.
1. Run the Application:
 Go to the elearning-server root into the command line
 > ./standalone.sh
 to bind to IP address as follows :
 > ./standalone.sh -b 172.xx.xxx.xx
 
 if you bind to IP address then you must edit shiro.ini
 
 realmC.casService = http://localhost:8080/elearning
 
 ==> realmC.casService = http://172.xx.xxx.xx:8080/elearning
 

2.To access Firm Admin:

Type in the address bar of the browser:

http://localhost:8080/elearning/smartcloud/firmadmin/page/home.cpx

username: demo1@inetcloud.vn
password: inet@01

3.Then to access the preview, type in the address bar of the browser:

http://localhost:8080
or
http://localhost:8080/elearning/smartcloud/helloworld/page/index.cpx

