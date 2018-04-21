# HW3: Karaf-Twitter
The website is able to run locally via Karaf server

## Steps 
### Installing Karaf
1. Download Apache Karaf 4.2.0 at: http://apache.mirrors.hoobly.com/karaf/4.2.0/apache-karaf-4.2.0.tar.gz
2. Copy the downloaded file and paste on the desired directory
3. Go to inside the apache folder Run karaf thru:

        $ ./bin/karaf 
4. Once the Karaf is loaded run:

        karaf@root()> feature:install war
        
### Build Maven project
1. Navigate inside the maven project directory, in this case, it is called karaf-twitter
2. Open the terminal and run:

        $ mvn clean install
3. Open the folder called target and copy the .war file
4. Paste the .war file inside apache-karaf-4.2.0/deploy 

### Run your program
1. Open your web browser
2. Input: http://localhost:8181/karaf-twitter

# Expected results:

## Homepage
![Alt text](/JSON-parse-HTML/screenshots/karaf_homepage.jpg)

## Sample request
![Alt text](/JSON-parse-HTML/screenshots/sample1.jpg)

## Sample results
![Alt text](/JSON-parse-HTML/screenshots/Sample1_results.jpg)

## UML Class diagram
![Alt text](/JSON-parse-HTML/screenshots/UMLTwitterAPI.png)
