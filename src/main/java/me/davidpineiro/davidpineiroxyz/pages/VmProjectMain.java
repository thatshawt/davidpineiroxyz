package me.davidpineiro.davidpineiroxyz.pages;

import org.teavm.jso.browser.Window;
import org.teavm.jso.dom.html.HTMLButtonElement;
import org.teavm.jso.dom.html.HTMLDocument;
import org.teavm.jso.dom.html.HTMLElement;
import org.teavm.jso.dom.html.HTMLTextAreaElement;
import org.w3c.dom.html.HTMLParagraphElement;
import org.w3c.dom.html.HTMLTableCellElement;
import xyz.davidpineiro.genes.core.evolution.asm.registerMachine.RegisterMachine;

import java.util.Arrays;
import java.util.List;

public class VmProjectMain {
    private static HTMLDocument document = Window.current().getDocument();
    private static HTMLButtonElement helloButton = document.getElementById("hello-button").cast();

    private static HTMLButtonElement runUntilHaltButton = document.getElementById("runUntilHalt").cast();
    private static HTMLButtonElement stepButton = document.getElementById("step").cast();
    private static HTMLButtonElement resetButton = document.getElementById("reset").cast();
    private static HTMLButtonElement clearOutputButton = document.getElementById("clearOutput").cast();
    //private static HTMLButtonElement assembleAndLoadButton = document.getElementById("assembleAndLoad").cast();
    private static HTMLElement ip = document.getElementById("ip").cast();
    private static HTMLElement output = document.getElementById("output").cast();

    private static HTMLElement[] iregs = new HTMLElement[5];
    private static HTMLElement[] fregs = new HTMLElement[5];
    private static HTMLElement[] bregs = new HTMLElement[5];
    private static HTMLElement[] sregs = new HTMLElement[5];

    private static HTMLTextAreaElement programText = document.getElementById("programText").cast();

    static RegisterMachine registerMachine = new RegisterMachine(){
        @Override
        public void resetStateAndLoadProgram(List<Assembler.CompleteInstruction> instructions) {
            try {
//                System.out.println("reset state and loaded program");
                super.resetStateAndLoadProgram(instructions);
            } catch (InterruptException e) {
                throw new RuntimeException(e);
            }
            this.state.nativeCallMap.put("sys.println", (state) -> {
                output.setInnerHTML(output.getInnerHTML() + registerMachine.state.sreg[0] + "\n");
            });
        }
    };

    static void updateValues(){
        final RegisterMachine.State state = registerMachine.state;
        ip.setInnerText("ip: " + state.ip);
//        System.out.println("changed ip");
//        System.out.println(Arrays.toString(state.ireg));
        for(int i =0;i<5;i++){
//            System.out.println("changing register of i:" + i);
            iregs[i].setInnerText(String.valueOf(state.ireg[i]));
            fregs[i].setInnerText(String.valueOf(state.freg[i]));
            bregs[i].setInnerText(String.valueOf(state.breg[i]));
            sregs[i].setInnerText(String.valueOf(state.sreg[i]));
        }
    }

    public static void main(String[] args) {
        //get all the register html elements
        for(int i =0;i<5;i++){
            iregs[i] = document.getElementById("ireg" + i).cast();
            fregs[i] = document.getElementById("freg" + i).cast();
            bregs[i] = document.getElementById("breg" + i).cast();
            sregs[i] = document.getElementById("sreg" + i).cast();
        }

//        System.out.println("label 1");
//        System.out.println(registerMachine);

        helloButton.listenClick(event -> sayHello());

        resetButton.listenClick(event -> {
//            System.out.println("reset");

            registerMachine.resetState();
            updateValues();
        });

        stepButton.listenClick(e -> {
            registerMachine.step();
//        System.out.println("after it actually stepped");
            updateValues();
        });

        runUntilHaltButton.listenClick(e -> {
            System.out.println("run unti halt clicked");
            try {
                System.out.println("grabbing program from html element");
                final String programTextStuff = programText.getValue();
//                Window.alert(programTextStuff);

                System.out.println("about to lex the program...");
                List<RegisterMachine.Assembler.Lexer.Token> tokens =
                        RegisterMachine.Assembler.Lexer.lex(programTextStuff);
                System.out.printf("tokens: %s\n", tokens);

                System.out.println("about to parse the tokens...");
                List<RegisterMachine.Assembler.CompleteInstruction> instructions =
                        RegisterMachine.Assembler.Parser.parse(tokens);

                System.out.printf("instructions: %s\n", instructions);

                System.out.printf("resetStateAndLoadProgram...\n");
                registerMachine.resetStateAndLoadProgram(instructions);

            } catch (RegisterMachine.Assembler.Parser.WrongTypeException | RegisterMachine.InterruptException ex) {
                System.out.printf("error...\n");
                Window.alert(ex.getMessage());
            }
            System.out.println("ran unntil it halted");
            registerMachine.stepUntilHalt();
            updateValues();
        });

        clearOutputButton.listenClick(e -> {
            output.setInnerText("");
        });

    }

    private static void sayHello() {
        Window.alert("hello my sigma");
    }
}
