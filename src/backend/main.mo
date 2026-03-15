import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  var nextId = 0;

  let messagesList = List.empty<ContactMessage>();

  let admins = Map.fromIter(
    [(
      "2vxsx-fae",
      true,
    )].values()
  );

  func isAdmin(principal : Principal) : Bool {
    admins.containsKey(principal.toText());
  };

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let newMessage : ContactMessage = {
      id = nextId;
      name;
      email;
      message;
      timestamp = Time.now();
    };

    messagesList.add(newMessage);
    nextId += 1;
  };

  public query ({ caller }) func getAllMessages() : async [ContactMessage] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admins can view messages");
    };

    messagesList.toArray();
  };
};
