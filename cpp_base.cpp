// Hotel management system enhanced by Hunain Ahmed :)
#include <iostream>
#include <iomanip> // For setw() function
#include <string>

using namespace std;

// We used struct cause we are creating our own type(Room) just like int is a type
struct RoomStructured
{
    unsigned int roomNumber;
    string roomType;
    bool isBooked;
    bool isCheckedIn;    // New
    string checkInDate;  // New
    string checkOutDate; // New
    string guestName;
    string phoneNumber;
    string email;
    string marriageStatus;
    unsigned int days;
    float cost;
};

// Using classes
class HotelClass
{
    // Variables defined inside the private class can only be accessed in the HotelClass block
private:
    // The way we are initializing the array is just because we are not using the vectors feature of cpp
    // We did this thing with rooms cause we will set the max length of the array later
    RoomStructured *rooms = nullptr;
    float singleRoomCharge = 5000.0;  // Single room rate
    float doubleRoomCharge = 12000.0; // Double room rate
    unsigned int numberOfRooms = 0;

    // Variables and functions defined in public class can be accessed globally any where
public:
    // This is our constructer function which will set up the array of rooms
    HotelClass(unsigned int totalRooms)
    {
        // Updating private number of rooms variable
        numberOfRooms = totalRooms;
        // Setting up the max length of rooms array now
        rooms = new RoomStructured[totalRooms];

        // Setting the default value for each room
        for (int i = 0; i < totalRooms; i++)
        {
            rooms[i].roomNumber = i + 1;
            if (i < 5)
                rooms[i].roomType = "Single";
            else
                rooms[i].roomType = "Double";
            rooms[i].isBooked = false;
            rooms[i].isCheckedIn = false; // Set checked-in status to false initially
            rooms[i].checkInDate = "";    // Initialize check-in date to an empty string
            rooms[i].checkOutDate = "";   // Initialize check-out date to an empty string
            rooms[i].guestName = "";
            rooms[i].phoneNumber = "";
            rooms[i].email = "";
            rooms[i].marriageStatus = "";
            rooms[i].days = 0;
            rooms[i].cost = 0.0;
        }
    }

    // For displaying available rooms
    void displayAvailableRooms()
    {
        for (int i = 0; i < numberOfRooms; i++)
        {
            if (rooms[i].roomType == "Single")
                cout << "'" << rooms[i].roomNumber << "' '" << rooms[i].roomType << "' '" << rooms[i].isBooked << "' ";
        }

        for (int i = 0; i < numberOfRooms; i++)
        {
            if (rooms[i].roomType == "Double")
                cout << "'" << rooms[i].roomNumber << "' '" << rooms[i].roomType << "' '" << rooms[i].isBooked << "' ";
        }
    }

    // This function is responsible for booking a room
    void bookRoom(int roomNumber, const string &guestName, const string &phoneNumber, const string &email, const string &marriageStatus, int days)
    {
        bool roomFound = false;
        // Finding the requested room number among all non booked rooms
        for (int i = 0; i < numberOfRooms; i++)
        {
            if (rooms[i].roomNumber == roomNumber && !rooms[i].isBooked)
            {
                // Updating rooms values
                rooms[i].isBooked = true;
                rooms[i].guestName = guestName;
                rooms[i].phoneNumber = phoneNumber;
                rooms[i].email = email;
                rooms[i].marriageStatus = marriageStatus;
                rooms[i].days = days;

                // Calculate cost based on room type
                if (rooms[i].roomType == "Single")
                {
                    rooms[i].cost = days * singleRoomCharge;
                }
                else if (rooms[i].roomType == "Double")
                {
                    rooms[i].cost = days * doubleRoomCharge;
                }

                // Sending the success message to the user
                cout << "success";

                // Room found
                roomFound = true;
                break;
            }
        }

        // Checking if room found or not
        if (!roomFound)
            cout << "failed";
    }

    // This function will cancel the booking
    void cancelBooking(int roomNumber)
    {
        bool roomFound = false;
        for (int i = 0; i < numberOfRooms; i++)
        {
            // Finding the requested room which is booked
            if (rooms[i].roomNumber == roomNumber && rooms[i].isBooked)
            {
                // Resetting the room information
                rooms[i].roomNumber = i + 1;
                rooms[i].roomType = "Single";
                rooms[i].isBooked = false;
                rooms[i].guestName = "";
                rooms[i].phoneNumber = "";
                rooms[i].email = "";
                rooms[i].marriageStatus = "";
                rooms[i].days = 0;
                rooms[i].cost = 0.0;
                // Checkout reset
                rooms[i].isCheckedIn = false;

                // Sending the success message to the user
                cout << "success";

                // Room found
                roomFound = true;
                break;
            }
        }

        // Checking if room found or not
        if (!roomFound)
            cout << "not-found";
    }

    // checkIn
    void checkIn(int roomNumber, const string &checkInDate)
    {
        bool roomFound = false;
        for (int i = 0; i < numberOfRooms; i++)
        {
            if (rooms[i].roomNumber == roomNumber && rooms[i].isBooked && !rooms[i].isCheckedIn)
            {
                // Update room status to checked in
                rooms[i].isCheckedIn = true;
                rooms[i].checkInDate = checkInDate;
                cout << "'" << rooms[i].guestName << "' '" << rooms[i].roomNumber << "' '" << rooms[i].days << "' '" << rooms[i].cost << "' '" << rooms[i].checkInDate << "' ";
                roomFound = true;
                break;
            }
        }
        if (!roomFound)
            cout << "not-found";
    }

    // CheckOut
    void checkOut(int roomNumber, const string &checkOutDate)
    {
        bool roomFound = false;
        for (int i = 0; i < numberOfRooms; i++)
        {
            if (rooms[i].roomNumber == roomNumber && rooms[i].isCheckedIn)
            {
                rooms[i].isCheckedIn = false;
                rooms[i].isBooked = false;
                rooms[i].checkOutDate = checkOutDate;

                // Displaying the bill
                cout << "'" << rooms[i].guestName << "' '" << rooms[i].roomNumber << "' '" << rooms[i].days << "' '" << rooms[i].cost << "' '" << rooms[i].checkInDate << "' ";

                // Reset room details
                rooms[i].guestName = "";
                rooms[i].phoneNumber = "";
                rooms[i].email = "";
                rooms[i].marriageStatus = "";
                rooms[i].days = 0;
                rooms[i].cost = 0.0;
                roomFound = true;
                break;
            }
        }
        if (!roomFound)
            cout << "not-found";
    }

    // This function will display all the available rooms
    void displayBookedRooms()
    {

        bool anyRoomBooked = false; // This will check if any room is booked

        // Iterate through all rooms to find booked ones
        for (int i = 0; i < numberOfRooms; i++)
        {
            if (rooms[i].isBooked)
            {
                anyRoomBooked = true; // Mark as true if a booked room is found

                // Sending the output to the GUI
                cout << "'" << rooms[i].roomNumber << "' '" << rooms[i].roomType << "' '" << rooms[i].guestName << "' '" << rooms[i].phoneNumber << "' '" << rooms[i].email << "' '" << rooms[i].days << "' '" << rooms[i].cost << "' ";
            }
        }

        // If no rooms are booked
        if (!anyRoomBooked)
        {
            cout << "empty";
        }
    }

    void costCalc(int days, bool isSingleRoom)
    {
        float costs = days * (isSingleRoom ? singleRoomCharge : doubleRoomCharge);
        cout << costs;
    }
};

// Arguments are passed to main cause GUI section will comunicate through it
int main(int argc, char *argv[])
{

    // Starting the hoted class var
    HotelClass hotel(10);

    // Starting handshake with GUI
    if (argc > 1 && argv[1] == "handshake")
        for (int i = 2; i < argc; i += 7)
        {
            hotel.bookRoom(std::stoi(argv[i]), argv[i + 1], argv[i + 2], argv[i + 3], argv[i + 4], std::stoi(argv[i + 5]));
        }

    int choice, roomNumber, days;
    string guestName, phoneNumber, email, marriageStatus;
    string checkInDate = "";  // Initialize the date variables
    string checkOutDate = ""; // Initialize the date variables

    // GUI data request finisher
    string finalData = "pending";

    do
    {
        // system("cls");
        // Sending the signal to GUI that we are ready

        cin >> choice;
        cin.ignore();

        switch (choice)
        {
        case 1:
            hotel.displayAvailableRooms();
            break;
        case 2:
            cout << "Enter Room Number to book: ";
            cin >> roomNumber;
            cout << "Enter Guest Name: ";
            cin.ignore();
            getline(cin, guestName);
            cout << "Enter Phone Number: ";
            getline(cin, phoneNumber);
            cout << "Enter Email: ";
            getline(cin, email);
            cout << "Enter Marriage Status: ";
            getline(cin, marriageStatus);
            cout << "For how many days are you booking the room? ";
            cin >> days;
            hotel.bookRoom(roomNumber, guestName, phoneNumber, email, marriageStatus, days);

            // Finalizing the GUI form
            cin >> finalData;
            if (finalData == "processed")
            {
                finalData = "pending";
                cout << "success";
            }
            break;
        case 3:
            cout << "Enter Room Number to cancel booking: ";
            cin >> roomNumber;
            hotel.cancelBooking(roomNumber);
            // Finalizing the GUI form
            cin >> finalData;
            if (finalData == "processed")
            {
                finalData = "pending";
                cout << "success";
            }

            // Finalizing the GUI form
            cin >> finalData;
            if (finalData == "processed")
            {
                finalData = "pending";
                cout << "success";
            }
            break;
        case 4:
            hotel.displayBookedRooms();
            break;
        case 5:
            cout << "Enter Room Number to Check-In: ";
            cin >> roomNumber;
            cout << "Enter Check-In Date (e.g., YYYY-MM-DD): ";
            cin.ignore();              // Ignore newline from previous input
            getline(cin, checkInDate); // Get check-in date
            hotel.checkIn(roomNumber, checkInDate);

            // Finalizing the GUI form
            cin >> finalData;
            if (finalData == "processed")
            {
                finalData = "pending";
                cout << "success";
            }
            break;
        case 6:
            cout << "Enter Room Number to Check-Out: ";
            cin >> roomNumber;
            cout << "Enter Check-Out Date (e.g., YYYY-MM-DD): ";
            cin.ignore();               // Ignore newline from previous input
            getline(cin, checkOutDate); // Get check-out date
            hotel.checkOut(roomNumber, checkOutDate);
            // Finalizing the GUI form
            cin >> finalData;
            if (finalData == "processed")
            {
                finalData = "pending";
                cout << "success";
            }
            break;
        case 7:
            cout << "Exiting the system. Thank you for using The Castle of Programmers Hotel!\n";
            break;
        case 8:
            cout << "Enter the days: ";
            cin >> days;
            cout << "Enter the marriage status: ";
            cin >> marriageStatus;
            hotel.costCalc(days, (marriageStatus == "Single") ? true : false);
            // Finalizing the GUI form
            cin >> finalData;
            if (finalData == "processed")
            {
                finalData = "pending";
                cout << "success";
            }
            break;
        default:
            cout << "'invalid-choice' " << choice;
        }
    } while (choice != 7);

    return 0;
}