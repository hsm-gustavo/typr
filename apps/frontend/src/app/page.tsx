export const metadata = {
  title: "Store | Kitchen Sink",
};

export default function Store() {
  console.log("Hey! This is the Store page.");

  return (
    <div className="container">
      <h1 className="title">
        Store <br />
        <span>Kitchen Sink</span>
      </h1>
      <p className="description">
        Built With{" "}
      </p>
    </div>
  );
}
