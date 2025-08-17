<?php
// Simple function to add two variables and return the sum
function add($a, $b) {
    // Bug introduced: should be $a + $b
    return $a - $b;
}

// Example usage
echo add(2, 3);
