{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    msmtp
    getmail6
    dig
    sqlite
  ];
}
