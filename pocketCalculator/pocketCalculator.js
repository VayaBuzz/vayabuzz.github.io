var module = angular.module("myapp", []);

// Custom Filter that handles properly displaying the number
// array on the LCD screen.
module.filter("lcdFormat", function() {
  return function(numberArray) {
    if (numberArray.length === 0) {
      return "0";
    } else {
      return numberArray.join("");
    }
  };
});

// Custom Filter that handles properly displaying the history
// array on the LCD screen.
module.filter("historyFormat", function() {
  return function(histArray) {
    if (histArray.length === 0) {
      return "";
    } else {
      return histArray.join("");
    }
  };
});

// Controller for our AngularJS Framework. Controllers rule.
module.controller("myCtrl", function($scope) {
  $scope.currentNumberArray = []; // growable/shrinkable array of individual numeric chars: what's on screen
  $scope.historyArray = []; // smaller text shows history of what we're calculating
  //$scope.mathStack = [];          // array of actual numbers and math symbols that are combined to do math.
  $scope.operandPressed = false; // used to track if we've entered a least a starter value.
  $scope.solutionFound = false; // used to track if we are currently displaying a solution.
  $scope.myResult = 0;
  $scope.resultFound = false;
  $scope.regNum = /[0-9]/;

  $scope.doMath = function(charArray) {
    // Example input: doMath([8,8," + ",1,2,"+",2,5]);
    // Example output: 125
    // Example input2: doMath([8,8," + ",1,2,"+",2,5, '+  ',1,0,0, '-', 5]);
    // Example output2: 220

    var numericValue = ""; // string we build, one numeric character at a time in first loop below.
    var numbersArray = []; // will hold numeric values e.g. [88,12,25,100]
    var operatorsArray = []; // will holder operator commands e.g.['add','add','subtract','multiply']
    var result = 0; // return this at end of function.

    // So that this works for big chains of operations, here's the plan:
    // read the input array left to right.
    // The creation of "numericValue" is complete when we run into a +,-,/,or * char.
    // so, add the numericValue to a new array of Operands
    // Likewise, add any operators to the separate array of operators.
    //
    // Finally, loop through the Operands and apply the operations from the operator array to them, yo.

    // loop through array of chars to separate the nums from the operators
    for (var i = 0; i < charArray.length; i++) {
      //console.log('i: '+ charArray[i]);

      // Detect individual numeric characters 0-9, join them together into the numericValue string
      if (!isNaN(charArray[i])) {
        numericValue = numericValue + charArray[i];
        //console.log('numberValue: ' + numericValue);

        // Otherwise detect the mathematical operator character
      } else {
        switch (charArray[i].trim()) {
          case "+":
            operatorsArray.push("add");
            break;
          case "-":
            operatorsArray.push("subtract");
            break;
          case "*":
            operatorsArray.push("multiply");
            break;
          case "/":
            operatorsArray.push("divide");
            break;
          default:
            throw "doMath() error: Unrecognized character in array. Please supply only  +,-,/, or *.";
        }
        numbersArray.push(parseInt(numericValue));
        numericValue = "";
      }
    }
    numbersArray.push(parseInt(numericValue));

    // Now that we have an array of operands and an array of operators,
    // loop through the operands and apply the operators to them.
    // the result will go into the zero position of the operands array,
    // and we'll methodically shrink the operands array as we do each operation.
    while (numbersArray.length > 1) {
      switch (operatorsArray[0]) {
        case "add":
          result = numbersArray[0] + numbersArray[1];
          break;
        case "subtract":
          result = numbersArray[0] - numbersArray[1];
          break;
        case "multiply":
          result = numbersArray[0] * numbersArray[1];
          break;
        case "divide":
          result = numbersArray[0] / numbersArray[1];
          break;
        default:
          throw "doMath() error: Unrecognized operator in array argument.";
      }
      numbersArray.shift(); // pop off the old leftmost numbers array value.
      numbersArray[0] = result; // The new leftmost array value is result.
      operatorsArray.shift(); // pop off the old leftmost operator.
    }
    return result; // single numeric value
  };

  // Appends one character argument to the currentNumberArray. Invokes math if necessary.
  $scope.clickHandler = function(freshChar) {
    switch (freshChar) {
      case 0:
        var zeroCheck = $scope.currentNumberArray.length;
        if (
          zeroCheck > 0 &&
          zeroCheck < 10 &&
          $scope.operandPressed === false
        ) {
          $scope.currentNumberArray.push(freshChar);
          $scope.historyArray.push(freshChar);
        }
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        if ($scope.operandPressed === false) {
          if ($scope.currentNumberArray.length < 10) {
            $scope.currentNumberArray.push(freshChar);
            $scope.historyArray.push(freshChar);
          }
        } else {
          //  operandPressed is true, and someone just started to enter a new number
          $scope.operandPressed = false; // reset the flag
          $scope.currentNumberArray = [];
          $scope.currentNumberArray.push(freshChar);
          $scope.historyArray.push(freshChar);
        }
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        if ($scope.resultFound === true) {
          $scope.historyArray = [];
          $scope.historyArray.push($scope.myResult);
          $scope.resultFound = false;
        }
        if ($scope.currentNumberArray.length > 0) {
          $scope.historyArray.push(" " + freshChar + " ");
          $scope.operandPressed = true;
        }
        break;
      case "=":
        if (
          $scope.currentNumberArray.length > 0 &&
          $scope.resultFound === false
        ) {
          try {
            $scope.myResult = $scope.doMath($scope.historyArray);
            $scope.currentNumberArray = [$scope.myResult];
            $scope.historyArray.push(" " + freshChar + " " + $scope.myResult);
            $scope.resultFound = true;
          } catch (e) {
            alert(e);
          }
        }
        break;
      case "ce":
        // determine length of current charArray,
        // then only remove that many characters from
        // history and currentNum
        var tempLen = $scope.currentNumberArray.length;
        for (var i = 0; i < tempLen; i++) {
          $scope.deleteChar(); //$scope.historyArray.pop();
        }
        break;
      case "c":
        // Start Fresh!
        $scope.currentNumberArray = [];
        $scope.historyArray = [];
        $scope.resultFound = false;
        break;
      case "del":
        if ($scope.resultFound === false){
          // this still needs work. It should only delete numbers, not operands
          var lastCharPos = $scope.historyArray.length -1;
          //alert(lastCharPos);
          //alert($scope.regNum.test($scope.historyArray[lastCharPos].toString()));
          if($scope.regNum.test($scope.historyArray[lastCharPos].toString()) === true){
            $scope.deleteChar();
          }
        };  
        break;
    }
  };

  // Deletes one character from end of array
  $scope.deleteChar = function() {
    if ($scope.currentNumberArray.length > 0) {
      $scope.currentNumberArray.pop();
      $scope.historyArray.pop();
    }
  };
});

/*
// user case CE
1) Press CE button
2) stack initialized
3) display value goes to zero.
4) previous math stack values unaffected.

// user case C
1) Press C button
2) stack initialized
3) display value goes to zero.
4) previous values cleared

//
// Basic Math User Case 1
//
1) User presses numeric number any number of times. 
      This builds the stack of numbers as currentNumberArray.
      Screen updates new number automatically.
 2) User presses operand button (+,-,*, or/)
      stack is converted to a number and assigned to num1.
      operandtype is set.
      stack is cleared.
 3) User presses numeric number any number of times.  
      This builds the stack of nmubers as currentNumberArray.
      Screen updates new number automatically.
 4) User presses = button
      stack is converted to a number and assigned to num2.
      num1 and num2 have operand performed on them.
      result updated to screen
      stack is cleared

// User case 2
1) continue from user case 1.
2) User immediatly presses + again to add to previous sum
3) user enters number
4) user hits equal sign
5) new result should show on screen.

//
// Delete key user case
// 
1) Deletes numbers from screen
2) when last number is deleted, screen should be zero.


//
// _x_to-do: add filter so that if screen is "blank", zero will appear by default.
// ___ to-do: creating new empty arrays is wasteful. see if it's worthwhile to just push/pop single array.
// ___ to-do: create list of surfer words for when max chars are reached: 
       "Dude! Gnarly! Bodacious! Far Out! Bogus! Akaw! Bail! burp-ums!
*/
