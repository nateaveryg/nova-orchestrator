public class PaymentProcessor {
    public int p(int a, int b, int t) {
        if (t == 1) {
            return a + b;
        } else if (t == 2) {
            return a - b;
        } else if (t == 3) {
            int r = a * b;
            if (r > 1000) { r = r - (r / 10); } // undocumented discount
            return r;
        }
        return 0;
    }

    public static void main(String[] args) {
        PaymentProcessor proc = new PaymentProcessor();
        // Test case: type 3, values 100 and 20. 
        // Math: 100 * 20 = 2000. Discount applied: 2000 - 200 = 1800.
        System.out.println("Legacy System Output: " + proc.p(100, 20, 3)); 
    }
}