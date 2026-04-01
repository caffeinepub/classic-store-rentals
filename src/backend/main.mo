import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  type Product = {
    id : Text;
    name : Text;
    description : Text;
    pricePerDay : Nat;
    category : Text;
  };

  type Booking = {
    id : Text;
    customerName : Text;
    phone : Text;
    equipment : Text;
    startDate : Text;
    endDate : Text;
    address : Text;
    submittedAt : Int;
  };

  let products = Map.empty<Text, Product>();
  let bookings = Map.empty<Text, Booking>();

  // Seed initial products
  private func seedProducts() {
    let seedData : [Product] = [
      {
        id = "1";
        name = "Projector";
        description = "High quality projector for presentations and entertainment";
        pricePerDay = 999;
        category = "Display";
      },
      {
        id = "2";
        name = "LED TV";
        description = "Large LED TV for events and viewing";
        pricePerDay = 799;
        category = "Display";
      },
      {
        id = "3";
        name = "Speakers";
        description = "Professional speakers for events";
        pricePerDay = 499;
        category = "Audio";
      },
      {
        id = "4";
        name = "Sound System";
        description = "Complete sound system for large events";
        pricePerDay = 1499;
        category = "Audio";
      },
    ];

    for (product in seedData.vals()) {
      products.add(product.id, product);
    };
  };

  seedProducts();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management Functions
  public query ({ caller }) func getProducts() : async [Product] {
    // Public access - no authorization check needed
    products.values().toArray().sort();
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(productId);
  };

  // Booking Functions
  public shared ({ caller }) func submitBooking(booking : Booking) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit bookings");
    };
    if (bookings.containsKey(booking.id)) {
      Runtime.trap("Booking already exists");
    };
    bookings.add(booking.id, booking);
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray();
  };
};
